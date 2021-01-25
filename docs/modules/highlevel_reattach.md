[@iota/iota.js](../README.md) / highLevel/reattach

# Module: highLevel/reattach

## Table of contents

### Functions

- [reattach](highlevel_reattach.md#reattach)

## Functions

### reattach

▸ **reattach**(`client`: [*IClient*](../interfaces/models/iclient.iclient.md), `messageId`: *string*): *Promise*<{}\>

Reattach an existing message.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`client` | [*IClient*](../interfaces/models/iclient.iclient.md) | The client to perform the reattach with.   |
`messageId` | *string* | The message to reattach.   |

**Returns:** *Promise*<{}\>

The id and message that were reattached.