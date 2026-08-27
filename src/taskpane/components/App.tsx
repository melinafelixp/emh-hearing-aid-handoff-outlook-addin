import * as React from "react";
import { Header } from "./Header";
import { CampaignSection } from "./CampaignSection";
import { DeploymentSection } from "./DeploymentSection";
import { TargetingSection } from "./TargetingSection";
import { CreativeDetailsSection } from "./CreativeDetailsSection";
import { SourceSpecificSection } from "./SourceSpecificSection";
import { AttachmentsSection } from "./AttachmentsSection";
import { SeedPreviewSection } from "./SeedPreviewSection";
import { EmailPreviewSection } from "./EmailPreviewSection";
import { FormActions } from "./FormActions";
import { useCampaignForm } from "../hooks/useCampaignForm";

export function App() {
  const form = useCampaignForm();
  const { campaign, validation } = form;

  return (
    <div id="taskpane-root">
      <Header />

      <CampaignSection
        source={campaign.source}
        onSourceChange={form.setSource}
        clinicName={campaign.clinicName}
        onClinicNameChange={form.setClinicName}
        clinicSuggestions={form.clinicSuggestions}
        recentClinics={form.recentClinics}
        onApplyClinic={form.applyClinicProfile}
        appliedClinicProfile={form.appliedClinicProfile}
        clinicNameError={validation.fieldErrors.clinicName}
        sourceError={validation.fieldErrors.source}
      />

      <DeploymentSection
        firstDeploymentDate={campaign.firstDeploymentDate}
        onFirstDeploymentDateChange={(date) => form.updateCampaign({ firstDeploymentDate: date })}
        secondDeploymentDate={form.secondDeploymentDate}
        useStandardQuantity={campaign.useStandardQuantity}
        onUseStandardQuantityChange={(value) => form.updateCampaign({ useStandardQuantity: value })}
        emailsPerDeployment={campaign.emailsPerDeployment}
        onQuantityChange={(value) => form.updateCampaign({ emailsPerDeployment: value })}
        firstDeploymentDateError={validation.fieldErrors.firstDeploymentDate}
        quantityError={validation.fieldErrors.emailsPerDeployment}
      />

      <TargetingSection
        zipCodes={campaign.zipCodes}
        onZipCodesChange={(zips) => form.updateCampaign({ zipCodes: zips })}
        countsAttachment={campaign.countsAttachment}
        onAttachCountsFile={form.setCountsAttachment}
        onRemoveCountsFile={form.removeCountsAttachment}
        targetingError={validation.fieldErrors.targeting}
        zipCodesError={validation.fieldErrors.zipCodes}
      />

      <CreativeDetailsSection
        useCustomSubjectLine={campaign.useCustomSubjectLine}
        onUseCustomSubjectLineChange={(v) => form.updateCampaign({ useCustomSubjectLine: v })}
        customSubjectLine={campaign.customSubjectLine}
        onCustomSubjectLineChange={(v) => form.updateCampaign({ customSubjectLine: v })}
        resolvedSubjectLine={form.subjectLine}
        customSubjectLineError={validation.fieldErrors.customSubjectLine}
        useCustomPht={campaign.useCustomPht}
        onUseCustomPhtChange={(v) => form.updateCampaign({ useCustomPht: v })}
        customPht={campaign.customPht}
        onCustomPhtChange={(v) => form.updateCampaign({ customPht: v })}
        resolvedPht={form.pht}
        customPhtError={validation.fieldErrors.customPht}
      />

      <SourceSpecificSection
        source={campaign.source}
        additionalClientLiveSeeds={campaign.additionalClientLiveSeeds}
        onAdditionalClientLiveSeedsChange={(v) => form.updateCampaign({ additionalClientLiveSeeds: v })}
        stacieClientEmails={campaign.stacieClientEmails}
        onStacieClientEmailsChange={(v) => form.updateCampaign({ stacieClientEmails: v })}
        stacieClientEmailsError={validation.fieldErrors.stacieClientEmails}
        marketingSpecialist={campaign.marketingSpecialist}
        onMarketingSpecialistChange={form.setMarketingSpecialist}
        marketingSpecialistError={validation.fieldErrors.marketingSpecialist}
      />

      <AttachmentsSection
        htmlAttachment={campaign.htmlAttachment}
        onAttachHtml={form.setHtmlAttachment}
        onRemoveHtml={form.removeHtmlAttachment}
        htmlAttachmentError={validation.fieldErrors.htmlAttachment}
      />

      <SeedPreviewSection seeds={form.seeds} />

      <EmailPreviewSection outlookSubject={form.outlookSubject} html={form.previewHtml} />

      <FormActions
        isValid={validation.isValid}
        submitState={form.submitState}
        submitError={form.submitError}
        onSubmit={form.submit}
        onReset={form.resetCampaign}
      />
    </div>
  );
}
