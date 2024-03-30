Command Line Interface tools to assist on the development of my refactoring catalog work.

[![Continuous Integration](https://github.com/kaiosilveira/refactoring-catalog-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/refactoring-catalog-cli/actions/workflows/ci.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Minimum node.js version](https://img.shields.io/badge/nodejs-18.17.1-GREEN.svg)](https://github.com/kaiosilveira/refactoring-catalog-cli)
[![Minimum yarn version](https://img.shields.io/badge/yarn-1.22.19-GREEN.svg)](https://github.com/kaiosilveira/refactoring-catalog-cli)

# Refactoring catalog CLI

Command line interface created to assist in the developments of [@kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring), a working implementation of the Refactoring Catalog described in Martin Fowler's homonymous book.

## Installation

```bash
npm i @kaiosilveira/refactoring-catalog-cli
```

PS: External installations are blocked and require authorization. Contact me if you're interested on using it.

## Available commands

**`prepare-repository -r <repository_name>`**

Uses [Octokit](https://github.com/octokit) to:

- update the repository's description, tags, and URL on GitHub
- update the `README.md` file with the repository name
- update `package.json` with the repository name and URL

Sample usage:

```bash
npx @kaiosilveira/refactoring-catalog-cli prepare-repository -r rename-field
```

**`generate-cmt-table -r <repository_name>`**

Sample usage:

```bash
 npx @kaiosilveira/refactoring-catalog-cli generate-cmt-table -r rc-cli
```

The output will be a markdown table containing a list of commits, each row containing the commit's SHA, a remote link to it, and its description. Example:

| Commit SHA                                                                                     | Message                                                        |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [c96ddbc](https://github.com/kaiosilveira/tst/commit/c96ddbc298d8ea11c432942192bdb817580c5d68) | ✨ feat: add function to map commit text to a diff obj         |
| [23960a9](https://github.com/kaiosilveira/tst/commit/23960a95448bc0db035b669b080b03ed0f359985) | ✨ feat: add function to map commit history to diff objects    |
| [4b2c203](https://github.com/kaiosilveira/tst/commit/4b2c20316e702a5fa71604968ed91fce211c90d6) | ✨ feat: add function to generate commit diff markdown         |
| [9e8debe](https://github.com/kaiosilveira/tst/commit/9e8debea6bffbe706ecf5f05b4895cb52e591921) | ✨ feat: add function to fetch reversed cmt history with patch |
| [8e95ae8](https://github.com/kaiosilveira/tst/commit/8e95ae894a9c03c660674469a1fa89d8130a63b3) | 🤖 chore: bump js target to ES6                                |

**`generate-diff -f <first_commit_SHA> -l <last_commit_SHA>`**

```bash
npx @kaiosilveira/refactoring-catalog-cli generate-diff -f HEAD~5 -l HEAD~1 > TEST.md
```

Generates a formatted diff of a range of commits, including their patches. Sample output:

---

- assigning-to-input-param: rename `inputValue` to `result`:

```diff
+++ b/src/assigning-to-input-param/index.js
@@ -1,6 +1,6 @@
 export function discount(originalInputValue, quantity) {
-  let inputValue = originalInputValue;
-  if (inputValue > 50) inputValue = inputValue - 2;
-  if (quantity > 100) inputValue = inputValue - 1;
-  return inputValue;
+  let result = originalInputValue;
+  if (result > 50) result = result - 2;
+  if (quantity > 100) result = result - 1;
+  return result;
 }
```

- assigning-to-input-param: rename `originalInputValue` to `inputValue`:

```diff
+++ b/src/assigning-to-input-param/index.js
@@ -1,5 +1,5 @@
-export function discount(originalInputValue, quantity) {
-  let result = originalInputValue;
+export function discount(inputValue, quantity) {
+  let result = inputValue;
   if (result > 50) result = result - 2;
   if (quantity > 100) result = result - 1;
   return result;
```

---
