import { AttachmentInfo } from "../lib/types";
import { OUTLOOK_RECIPIENTS } from "../lib/contacts";

/** Reads a browser File into a base64 string (no data: prefix) for Office.js attachment APIs. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function setRecipientsAsync(field: Office.Recipients, recipients: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    field.setAsync(recipients, (result: Office.AsyncResult<void>) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve();
      } else {
        reject(result.error);
      }
    });
  });
}

function setSubjectAsync(subject: string): Promise<void> {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item?.subject.setAsync(subject, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve();
      } else {
        reject(result.error);
      }
    });
  });
}

/**
 * Inserts the campaign HTML at the very top of the existing draft body — never
 * replaces the body. This is deliberate: Office.js's body.setAsync() overwrites
 * everything (including a signature Outlook already inserted), while
 * body.prependAsync() leaves existing content — signature, images, custom HTML —
 * completely untouched and just adds our content above it.
 */
function prependBodyHtmlAsync(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item?.body.prependAsync(
      html,
      { coercionType: Office.CoercionType.Html },
      (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve();
        } else {
          reject(result.error);
        }
      }
    );
  });
}

function getAttachmentsAsync(): Promise<Office.AttachmentDetailsCompose[]> {
  return new Promise((resolve) => {
    const item = Office.context.mailbox.item as Office.MessageCompose | undefined;
    if (!item || !item.getAttachmentsAsync) {
      resolve([]);
      return;
    }
    item.getAttachmentsAsync((result: Office.AsyncResult<Office.AttachmentDetailsCompose[]>) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        resolve(result.value);
      } else {
        resolve([]); // don't block the handoff over a read failure
      }
    });
  });
}

function addFileAttachmentFromBase64Async(fileName: string, base64: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const item = Office.context.mailbox.item as Office.MessageCompose | undefined;
    if (!item || !item.addFileAttachmentFromBase64Async) {
      reject(new Error("Attachment API unavailable in this Outlook client."));
      return;
    }
    item.addFileAttachmentFromBase64Async(
      base64,
      fileName,
      { isInline: false },
      (result: Office.AsyncResult<string>) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve();
        } else {
          reject(result.error);
        }
      }
    );
  });
}

/** Attaches a file only if a same-named attachment isn't already on the draft. */
async function attachIfMissing(attachment: AttachmentInfo): Promise<void> {
  const existing = await getAttachmentsAsync();
  const alreadyAttached = existing.some((a) => a.name === attachment.fileName);
  if (alreadyAttached) return;
  await addFileAttachmentFromBase64Async(attachment.fileName, attachment.base64);
}

export interface PopulateEmailInput {
  outlookSubject: string;
  bodyHtml: string;
  htmlAttachment: AttachmentInfo;
  countsAttachment: AttachmentInfo | null;
}

/**
 * Populates the active compose item with recipients, subject, body, and
 * attachments. Throws on the first failure — the caller is responsible for
 * surfacing a clear error and preserving the user's form input (nothing here
 * clears form state).
 */
export async function populateOutlookEmail(input: PopulateEmailInput): Promise<void> {
  const item = Office.context.mailbox.item;
  if (!item) {
    throw new Error("No active Outlook compose item was found.");
  }

  await setRecipientsAsync(item.to, OUTLOOK_RECIPIENTS.to);
  await setRecipientsAsync(item.cc, OUTLOOK_RECIPIENTS.cc);
  await setSubjectAsync(input.outlookSubject);
  await prependBodyHtmlAsync(input.bodyHtml);
  await attachIfMissing(input.htmlAttachment);
  if (input.countsAttachment) {
    await attachIfMissing(input.countsAttachment);
  }
}
