# 🐄 Conga LWC Patterns for Salesforce

This repository contains multiple Lightning Web Components that all launch **Conga Composer**, each following a different pattern depending on the business use case (barn-based reports, IMV selection exports, bull reports, multi-query production reports, etc.).

All components use a **shared Apex controller** and a **metadata-driven configuration** so IDs and behavior can be updated by admins without code changes.

> 📌 **Note:** Most of these LWCs do *not* run on a specific Salesforce record page. They use a **dummy record** from metadata to satisfy Conga URL requirements.

---

## 🏗 High-Level Architecture

### 1. Apex Controller — `Pro_ModifyProduction_con`

A small controller providing two services:

#### `getCongaSettings()`

Returns all records from `pro_Conga_Settings__mdt` in the format:  
`Map<DeveloperName, pro_Value__c>`

Used in LWCs like:

```js
this.congaSettings.DummyRecord
this.congaSettings.IMVQuery
this.congaSettings.StandardTemplate
```

#### `getTemplateIdByBarn(barnName)`

Looks up a **barn-specific template override** from CMDT `pro_CongaBarnMapping__mdt`.

If no barn match exists → LWC falls back to `StandardTemplate`.

---

## 🗂 Metadata Used

### `pro_Conga_Settings__mdt` (Global Key/Value Configuration)

| DeveloperName             | Description                                                   |
|---------------------------|---------------------------------------------------------------|
| DummyRecord               | Salesforce record ID used in all Conga Composer launches      |
| StandardTemplate          | Default/fallback Conga Template                               |
| AllProductsQuery          | Query for “All” product types                                 |
| BarnQuery                 | Query used for specific product types                         |
| IMVTemplate               | Template used for IMV mass-print                              |
| IMVQuery                  | IMV query ID                                                  |
| BullReportTemplateQuery   | Template used for bull report                                 |
| BullReportQuery           | Header query for bull report                                  |
| BullReportLineQuery       | Line query for bull report                                    |
| Sexed_Query_Id__c         | Query for “Sexed” production                                  |
| Conv_Query_Id__c          | Query for “Conventional” production                           |
| Fresh_Query_Id__c         | Query for “Fresh” production                                  |

These *must* match the LWCs’ expected developer names.

---

### `pro_CongaBarnMapping__mdt` (Barn → Template Mapping)

| Field              | Description                      |
|--------------------|----------------------------------|
| pro_Barn_Name__c   | The barn label as shown in UI    |
| pro_Template_Id__c | Template override for that barn  |

If no match exists → uses `StandardTemplate`.

---

## 🌐 Shared LWC Pattern (Used by All LWCs)

```js
import getCongaSettings from '@salesforce/apex/Pro_ModifyProduction_con.getCongaSettings';
import getTemplateIdByBarn from '@salesforce/apex/Pro_ModifyProduction_con.getTemplateIdByBarn';

connectedCallback() {
    getCongaSettings().then(data => {
        this.congaSettings = data; // Map<DeveloperName, Value>
    }).catch(error => {
        console.error('Error loading Conga settings:', error);
    });
}
```

All LWCs then construct a Conga URL of the form:

```text
/apex/APXTConga4__Conga_Composer?SolMgr=1
    &serverUrl=<origin>
    &id=<dummy record>
    &QueryId=<query string>
    &TemplateId=<template id>
```

---

# 📚 LWC Patterns Included in This Repo

---

## 1️⃣ Pattern: Date + Barn + Product Type (CongaClick1)

**Use Case:** User selects Date → Barn → Product Type.

**Logic:**

- If Product Type = **All**  
  → Use `AllProductsQuery`
- Else  
  → Use `BarnQuery` and pass product type as `pv2`

**Parameters:**

| PV  | Meaning        |
|-----|----------------|
| pv0 | Selected Date  |
| pv1 | Barn ID        |
| pv2 | Product Type (if not "All") |

**QueryId example:**

```text
[jr]<QueryId>?pv0=...~pv1=...~pv2=...
```

This LWC also supports **barn-based template overrides** via CMDT.

---

## 2️⃣ Pattern: IMV Multi-Record Mass Print (CongaClick2)

**Use Case:** User selects multiple rows in a datatable → generate document.

**Logic:**

- Selected record IDs are joined like: `'id1'|'id2'|'id3'`
- Sent as `pv0`
- Query filters with `Id in ({pv0})`

**Parameters:**

| PV  | Meaning                    |
|-----|----------------------------|
| pv0 | Pipe-delimited record IDs |

**QueryId example:**

```text
[imv]<QueryId>?pv0='id1'|'id2'|'id3'
```

---

## 3️⃣ Pattern: Bull Report (Header + Line Queries) (CongaClick3)

**Use Case:** Generate a bull-level report with line-level details.

**Multi-query structure:**

```text
[QCQ]<HeaderQueryId>,
[QCSQ]<LineQueryId>?pv0=...
```

**Parameters:**

| PV  | Meaning                     |
|-----|-----------------------------|
| pv0 | Selected stock record IDs  |

Conga Composer receives both query results in one run.

---

## 4️⃣ Pattern: Multi-Query Production Export (Sexed, Conv, Fresh) (CongaClick4)

**Use Case:** Run *three* product category queries in a single Conga document.

**Multi-query structure:**

```text
[sexed]<SexedQuery>?pv0=...~pv1=...
,[conv]<ConvQuery>?pv0=...~pv1=...
,[fresh]<FreshQuery>?pv0=...~pv1=...
```

**Parameters:**

| PV  | Meaning        |
|-----|----------------|
| pv0 | Selected Date |
| pv1 | Barn ID       |

Each query receives the same PV values.

Supports barn-based template overrides.

---
