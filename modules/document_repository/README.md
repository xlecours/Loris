# Document Repository

## Purpose

The Document Repository provides a centralized location for non-candidate
documents that are relevant to the study (i.e. unfilled versions of
instruments, publications, or manual of operations).

## Intended Users

This module is used primarily by study coordinators/administrators
who share study protocols and manuals, as well as data entry staff who
consult these documents.

## Scope

Users can view, download, upload, and delete files, as well as edit
information pertaining to those files. Note that this module predate
our database schema revamp so there is no foreign key between the file
and the Candidates, Visits or Instruments. This module will stored the
values but integrity must be maintaint manually and/or by convention.

## Permissions

A user that has "document_repository_view" permission can view and
upload files in Document Repository.  Additionnaly, a user that has
"document_repository_delete" permission can also delete files.

## Configurations

The Document Repository enables users to upload project files
of any type. PHP must be abal to read/write/execute files under
`modules/document_repository/user_uploads`.

A mail server is required to send out email notification regarding the
Document Repository updates.

## Interactions

Notifications from the Document Repository module are visible on the
Dashboard panel.

