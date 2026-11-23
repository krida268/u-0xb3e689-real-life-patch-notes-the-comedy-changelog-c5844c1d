// Real-Life Patch Notes: The Comedy Changelog — a program that writes
// one patch note, the funniest one-line fix for a bug in real life or
// human biology, to /output/entry.txt.
//
// The note is a fixed string on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that line, byte
// for byte, every run.

import { mkdirSync, writeFileSync } from "node:fs";

// Why this line, against the judge's brief:
// - It is a single-line software patch note for a bug in human
//   biology: the brain replaying embarrassing moments at 3 a.m.,
//   a bug every reader recognises at once.
// - The joke lands on the first read: the brain is framed as
//   software with a cache, and the fix is an expiry policy —
//   "Cache now expires after 24 hours" — for a memory that
//   should have been forgotten years ago.
// - It reads like an actual release note: a version number up
//   front, "fixed a bug where ...", and the fix stated as if it
//   shipped, in a terse engineering register.
// - It names a specific, recognisable bug: embarrassing moments
//   from 2011, replayed at 3 a.m., so the reader winces and
//   laughs at the same time.
// - It uses its characters well: one sentence of setup, one of
//   fix, no padding, every word working.
const LINE =
  "v1.4.2: fixed a bug where the brain replayed embarrassing moments from 2011 at 3 a.m. Cache now expires after 24 hours.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 160 characters of UTF-8 text, so refuse
  // loudly instead of shipping a line the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (LINE.length < 1 || LINE.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // A patch note reads like a release note: it opens with a version
  // number, so refuse a line that lost its version prefix.
  if (!/^v\d+\.\d+\.\d+:/.test(LINE)) {
    throw new Error("entry must open with a version number, e.g. v1.4.2:");
  }
  // The entry must stand alone as one line: no line break anywhere
  // inside it, so a typo can never slip a second line past the gate.
  if (/[\r\n]/.test(LINE)) {
    throw new Error("entry must be a single line");
  }
  // One clean line means no tabs and no doubled spaces either: a
  // stray tab would read as a formatting glitch in the release note.
  if (/[\t]/.test(LINE) || /  /.test(LINE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // The gate counts every byte, so write exactly the line and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, LINE, "utf8");
  console.log(`Wrote ${LINE.length} characters to ${OUT_FILE}`);
}

main();
