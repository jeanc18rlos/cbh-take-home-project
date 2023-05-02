# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Ticket 1: Add custom_id field to the Agents table

#### Description:
Add a new nullable field `custom_id` to the Agents table, which will store the custom id provided by the Facilities for each Agent they work with. This field will be used when generating reports.

#### Acceptance Criteria:
- The Agents table should have a new nullable field called `custom_id`
- Existing Agents records should not be affected and should have `custom_id` as `NULL`
- When creating a new Agent, it should be possible to set the `custom_id` field

#### Time/Effort Estimate: 2 hours

#### Implementation Details:
- Assuming the database is relational (e.g., MySQL, PostgreSQL), update the schema by adding a new nullable field `custom_id` (VARCHAR or TEXT) to the Agents table
- Assuming TypeORM is being used, update the Agent entity to include a new `custom_id` field, allowing NULL values and setting a unique constraint scoped by the Facility using the `@Unique` decorator
- Update any existing forms or API endpoints for creating/updating Agents to include the `custom_id` field, if applicable

### Ticket 2: Update `getShiftsByFacility` function to include custom_id

#### Description:
Update the `getShiftsByFacility` function to return the Agent's `custom_id` along with other metadata about the Agent assigned to each Shift.

#### Acceptance Criteria:
- The `getShiftsByFacility` function should return the Agent's `custom_id` for each Shift
- Existing functionality of `getShiftsByFacility` should remain unchanged
- Assuming the repository pattern is implemented in TypeScript with TypeORM, modify the repository to include a JOIN clause between the Agents and Shifts tables on the Agent's `id` and include the `custom_id` in the SELECT statement or use TypeORM's `createQueryBuilder` and `leftJoin` methods to achieve the same, if DDD is beign used , the use case should not be modified, only the repository implementation

#### Time/Effort Estimate: 2 hours

#### Implementation Details:
- Modify the `getShiftsByFacility` function to include the Agent's `custom_id` in the query or ORM model
- Ensure that the returned data includes the `custom_id` for each Agent assigned to a Shift

### Ticket 3: Update `generateReport` function to use custom_id

#### Description:
Update the `generateReport` function to use the Agent's `custom_id` instead of their internal database id when generating reports for Facilities.

#### Acceptance Criteria:
- The `generateReport` function should use the Agent's `custom_id` instead of their internal database id in the generated reports
- If the Agent doesn't have a `custom_id`, the
`generateReport` function should fallback to using their internal database id
- The generated PDF reports should display the correct Agent `custom_id` or internal database id, as per the updated logic

#### Time/Effort Estimate: 4 hours

#### Implementation Details:

- Modify the `generateReport` function to use the Agent's `custom_id` instead of their internal database id when generating reports
- Add a fallback mechanism to use the internal database id if the Agent's `custom_id` is not present
- Assuming the PDF generation is done using a library like pdfmake, update the PDF template to display the Agent's `custom_id` or internal database id based on the availability of `custom_id`

### Ticket 4: Add user interface for Facilities to set custom_id for Agents

#### Description:
Create a user interface that allows Facilities to set the `custom_id` for each Agent they work with. This interface should be easily accessible and integrated into the existing user flow.

#### Acceptance Criteria:
- Facilities should be able to set the `custom_id` for each Agent they work with
- Facilities should be able to update the `custom_id` for existing Agents


#### Time/Effort Estimate: 6 hours

#### Implementation Details:
- Assuming the front-end uses a framework like React, create a new component for setting the `custom_id` and integrate it into the existing Agent management page
- Implement form validation in the front-end to prevent submitting invalid `custom_id` values (e.g., duplicates, empty strings)
- Assuming the back-end uses a RESTful API with NestJS and TypeORM, update the relevant API endpoints to handle the `custom_id` field when creating or updating Agents through the user interface

### Ticket 5: Update documentation and inform Facilities about the new feature

#### Description:
Update the platform's documentation to include the new `custom_id` feature and inform Facilities about the availability of this new feature through email or other communication channels.

#### Acceptance Criteria:
- Documentation should be updated to include the new `custom_id` feature
- Facilities should be informed about the new feature through their preferred communication channel

#### Time/Effort Estimate: 2 hours

#### Implementation Details:
- Assuming the platform has an online help center, update the help center articles to cover the new `custom_id` feature and provide step-by-step instructions for using it
- Assuming the platform has a mailing list or notification system for Facilities, prepare an announcement email or in-app notification to inform them about the new feature and direct them to the updated help center articles for more information