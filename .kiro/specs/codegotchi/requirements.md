# Requirements — Codegotchi

## Introduction
A static web app: a pocket virtual pet that lives on the owner's GitHub
streak. The pet eats, plays, evolves, gets sick, and dies according to real
daily activity, rendered in a retro LCD egg-device frame.

## Requirements

### Requirement 1: Adopt a pet from GitHub activity
**User Story:** As a developer, I want the pet to reflect my real work, so
that keeping it alive means keeping my streak alive.

#### Acceptance Criteria
1. WHEN the page loads THEN the system SHALL show an egg device with a pet
   whose stage matches the entered GitHub user's current streak.
2. WHEN the user enters a GitHub username THEN the system SHALL fetch that
   user's public events (unauthenticated API) and compute the current
   daily streak.
3. WHEN the API is unreachable THEN the system SHALL fall back to manual
   check-in mode and say so plainly.
4. WHEN no username has been entered THEN the system SHALL default to
   sawi57003-ops.

### Requirement 2: Life stages and evolution
**User Story:** As a player, I want the pet to visibly grow as my streak
grows, so that long streaks feel rewarding.

#### Acceptance Criteria
1. WHEN the streak is 0 days THEN the pet SHALL be an Egg.
2. WHEN the streak reaches 1, 3, 7, 14, and 30 days THEN the pet SHALL
   evolve to Baby, Child, Teen, Adult, and Golden respectively.
3. WHEN the pet evolves THEN the system SHALL show an evolution animation
   and a new pixel-art form.
4. WHEN the streak breaks THEN the pet SHALL revert to Egg (after the
   death flow, see Requirement 4).

### Requirement 3: Needs, feeding, and play
**User Story:** As a player, I want to care for the pet every day, so that
daily engagement has a purpose.

#### Acceptance Criteria
1. WHEN a day passes with no activity THEN hunger and happiness SHALL each
   drop by one level.
2. WHEN the user records activity (commit detected or manual check-in)
   THEN hunger SHALL refill and the pet SHALL show a happy reaction.
3. WHEN the user plays "Bug Squash" THEN happiness SHALL rise and the
   score SHALL be shown.
4. WHEN hunger or happiness hits zero THEN the pet SHALL show a distressed
   state and warn the player.

### Requirement 4: Sickness, death, and the graveyard
**User Story:** As a player, I want neglect to have consequences, so that
the streak matters.

#### Acceptance Criteria
1. WHEN there are 2 consecutive days with no activity THEN the pet SHALL
   become sick (visual + status change).
2. WHEN activity resumes while sick THEN the pet SHALL recover.
3. WHEN there are 3+ consecutive days with no activity THEN the pet SHALL
   die and join the Graveyard with an epitaph showing its longest streak.
4. WHEN the pet dies THEN the system SHALL offer a new egg with the streak
   reset to zero.

### Requirement 5: Polish and shareability
**User Story:** As a player, I want a clean device UI and a way to share my
pet, so that the experience feels complete.

#### Acceptance Criteria
1. WHEN the page loads THEN the system SHALL show the egg device, the pet,
   streak, hunger/happiness meters, and stage without scrolling on desktop.
2. WHEN the user clicks Share THEN the system SHALL copy a summary
   ("My Codegotchi Byte is Adult, 14-day streak") for sharing.
3. WHEN the app is opened on a phone THEN the system SHALL remain playable
   (responsive layout, tap controls).
