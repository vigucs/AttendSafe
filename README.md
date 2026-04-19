# AttendSafe

AttendSafe is a desktop attendance planner for students. Add your subjects, mark classes as present or missed, build a weekly timetable, and see whether you can safely skip a class without falling below your required attendance.

## Download

Get the latest app from GitHub Releases:

- [Download for Windows](https://github.com/vigucs/AttendSafe/releases/latest/download/AttendSafe-Windows-Installer.exe)
- [Download for macOS](https://github.com/vigucs/AttendSafe/releases/latest/download/AttendSafe-macOS.dmg)

Windows users can run the installer directly. macOS builds are unsigned for now, so macOS may ask you to approve the app in System Settings > Privacy & Security the first time you open it.

## What You Can Do

- Track total, attended, and missed classes for each subject.
- See your current attendance percentage and required minimum.
- Check how many classes you can miss before dropping below your goal.
- See how many classes you need to attend to recover.
- Build a weekly timetable so Today only shows relevant classes.
- Simulate future attendance from the subject detail screen.
- Switch between light and dark themes.

## Local Data

AttendSafe stores your data locally on your computer in the Electron app data folder. It does not require an account or cloud sync.

## Developer Setup

Install dependencies:

```bash
npm install
```

Run the desktop app in development:

```bash
npm run dev
```

Run tests:

```bash
npm test -- --run
```

Build installers for the current platform:

```bash
npm run build
```

Build platform-specific installers:

```bash
npm run build:win
npm run build:mac
```

## Release Process

Releases are created from version tags.

1. Update the version in `package.json`.
2. Commit the change.
3. Create a tag, for example:

```bash
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will run tests, build the Windows and macOS installers, and attach them to the GitHub Release.

## Tech Stack

- React 19
- TypeScript
- Vite
- Electron
- Electron Builder
- Tailwind CSS
- Zustand
- better-sqlite3
- Vitest
