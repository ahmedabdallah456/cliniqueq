// FILE: app/study/components/SessionForm.tsx
"use client";

interface SessionFormProps {
  subject: string;
  setSubject: (value: string) => void;
  tagsString: string;
  setTagsString: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  disabled: boolean;
}

export default function SessionForm({
  subject,
  setSubject,
  tagsString,
  setTagsString,
  notes,
  setNotes,
  disabled,
}: SessionFormProps) {
  return (
    <form className="flex flex-col gap-2">
      <label htmlFor="subject" className="font-medium">
        Subject
      </label>
      <input
        id="subject"
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={disabled}
        className="border p-2 rounded"
        aria-required="true"
      />
      <label htmlFor="tags" className="font-medium">
        Tags (comma-separated)
      </label>
      <input
        id="tags"
        type="text"
        value={tagsString}
        onChange={(e) => setTagsString(e.target.value)}
        disabled={disabled}
        className="border p-2 rounded"
      />
      <label htmlFor="notes" className="font-medium">
        Notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 rounded h-24"
      />
    </form>
  );
}



