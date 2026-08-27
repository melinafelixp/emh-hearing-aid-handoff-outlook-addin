import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AttachmentInfo,
  ClinicProfile,
  HearingAidCampaign,
  JobSource,
  MarketingSpecialistName,
  emptyCampaign,
} from "../../lib/types";
import { calculateSecondDeploymentDate } from "../../lib/dateUtils";
import { validateCampaign } from "../../lib/validation";
import { getSeedResult } from "../../lib/seedLogic";
import {
  generateCampaignPht,
  generateCampaignSubjectLine,
  generateEmailHtml,
  generateOutlookSubject,
} from "../../lib/emailGenerator";
import { getSourceConfig } from "../../lib/sourceConfig";
import { getRecentClinics, saveClinic, searchClinics } from "../../services/clinicStorage";
import { fileToBase64, populateOutlookEmail } from "../../services/outlookService";

export type SubmitState = "idle" | "submitting" | "success" | "error";

export function useCampaignForm() {
  const [campaign, setCampaign] = useState<HearingAidCampaign>(emptyCampaign());
  const [clinicSuggestions, setClinicSuggestions] = useState<ClinicProfile[]>([]);
  const [recentClinics, setRecentClinics] = useState<ClinicProfile[]>([]);
  const [appliedClinicProfile, setAppliedClinicProfile] = useState<ClinicProfile | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string>("");

  useEffect(() => {
    getRecentClinics().then(setRecentClinics).catch(() => setRecentClinics([]));
  }, []);

  const secondDeploymentDate = useMemo(
    () => calculateSecondDeploymentDate(campaign.firstDeploymentDate),
    [campaign.firstDeploymentDate]
  );

  const sourceCfg = useMemo(() => getSourceConfig(campaign.source), [campaign.source]);
  const seeds = useMemo(() => getSeedResult(campaign), [campaign]);
  const validation = useMemo(() => validateCampaign(campaign), [campaign]);
  const subjectLine = useMemo(() => generateCampaignSubjectLine(campaign), [campaign]);
  const pht = useMemo(() => generateCampaignPht(campaign), [campaign]);
  const outlookSubject = useMemo(() => generateOutlookSubject(campaign), [campaign]);
  const previewHtml = useMemo(() => generateEmailHtml(campaign), [campaign]);

  const updateCampaign = useCallback((patch: Partial<HearingAidCampaign>) => {
    setCampaign((prev) => ({ ...prev, ...patch }));
  }, []);

  /** Changing sources clears every field that's specific to a *different* source. */
  const setSource = useCallback((source: JobSource) => {
    setCampaign((prev) => ({
      ...prev,
      source,
      additionalClientLiveSeeds: source === "SonaRev" ? prev.additionalClientLiveSeeds : [],
      stacieClientEmails: source === "Stacie" ? prev.stacieClientEmails : [],
      marketingSpecialist: source === "Phonak" || source === "Unitron" ? prev.marketingSpecialist : null,
    }));
  }, []);

  const setClinicName = useCallback(
    (name: string) => {
      updateCampaign({ clinicName: name });
      setAppliedClinicProfile(null);
      if (name.trim().length >= 2) {
        searchClinics(name)
          .then(setClinicSuggestions)
          .catch(() => setClinicSuggestions([]));
      } else {
        setClinicSuggestions([]);
      }
    },
    [updateCampaign]
  );

  /** Applies a remembered clinic's reusable info. Dates are never touched. */
  const applyClinicProfile = useCallback((profile: ClinicProfile) => {
    setCampaign((prev) => ({
      ...prev,
      clinicName: profile.clinicName,
      source: profile.lastSource ?? prev.source,
      zipCodes: profile.commonZipCodes ?? prev.zipCodes,
      stacieClientEmails: profile.clientEmails ?? prev.stacieClientEmails,
      marketingSpecialist: profile.lastMarketingSpecialist ?? prev.marketingSpecialist,
      emailsPerDeployment: profile.lastQuantity ?? prev.emailsPerDeployment,
      useStandardQuantity: profile.lastQuantity ? profile.lastQuantity === 25000 : prev.useStandardQuantity,
    }));
    setAppliedClinicProfile(profile);
    setClinicSuggestions([]);
  }, []);

  const setMarketingSpecialist = useCallback(
    (name: MarketingSpecialistName) => updateCampaign({ marketingSpecialist: name }),
    [updateCampaign]
  );

  const setHtmlAttachment = useCallback(
    async (file: File) => {
      const base64 = await fileToBase64(file);
      const attachment: AttachmentInfo = { fileName: file.name, base64, fileType: "html" };
      updateCampaign({ htmlAttachment: attachment });
    },
    [updateCampaign]
  );

  const setCountsAttachment = useCallback(
    async (file: File) => {
      const base64 = await fileToBase64(file);
      const attachment: AttachmentInfo = { fileName: file.name, base64, fileType: "counts" };
      updateCampaign({ countsAttachment: attachment });
    },
    [updateCampaign]
  );

  const removeHtmlAttachment = useCallback(() => updateCampaign({ htmlAttachment: null }), [updateCampaign]);
  const removeCountsAttachment = useCallback(() => updateCampaign({ countsAttachment: null }), [updateCampaign]);

  const submit = useCallback(async () => {
    const result = validateCampaign(campaign);
    if (!result.isValid) {
      setSubmitState("error");
      setSubmitError(result.errors[0]);
      return;
    }
    setSubmitState("submitting");
    setSubmitError("");
    try {
      await populateOutlookEmail({
        outlookSubject,
        bodyHtml: previewHtml,
        htmlAttachment: campaign.htmlAttachment!,
        countsAttachment: campaign.countsAttachment,
      });

      // Save/update the clinic profile only after a successful handoff.
      await saveClinic({
        clinicName: campaign.clinicName,
        source: campaign.source ?? undefined,
        zipCodes: campaign.zipCodes,
        clientEmails: campaign.source === "Stacie" ? campaign.stacieClientEmails : undefined,
        marketingSpecialist: campaign.marketingSpecialist ?? undefined,
        quantity: campaign.emailsPerDeployment,
      }).catch(() => undefined); // clinic memory failures should never block a completed handoff

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(
        err instanceof Error
          ? `We couldn't populate the Outlook message. Your campaign details have been preserved. (${err.message})`
          : "We couldn't populate the Outlook message. Your campaign details have been preserved."
      );
    }
  }, [campaign, outlookSubject, previewHtml]);

  const resetCampaign = useCallback(() => {
    setCampaign(emptyCampaign());
    setAppliedClinicProfile(null);
    setClinicSuggestions([]);
    setSubmitState("idle");
    setSubmitError("");
  }, []);

  return {
    campaign,
    updateCampaign,
    setSource,
    setClinicName,
    clinicSuggestions,
    recentClinics,
    applyClinicProfile,
    appliedClinicProfile,
    setMarketingSpecialist,
    setHtmlAttachment,
    setCountsAttachment,
    removeHtmlAttachment,
    removeCountsAttachment,
    secondDeploymentDate,
    sourceCfg,
    seeds,
    validation,
    subjectLine,
    pht,
    outlookSubject,
    previewHtml,
    submit,
    submitState,
    submitError,
    resetCampaign,
  };
}
