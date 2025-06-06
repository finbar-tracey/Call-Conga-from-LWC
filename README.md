# 🐄 Conga LWC Integration for Salesforce

![image](https://github.com/user-attachments/assets/a0bb5136-ba7c-4654-ab7b-d8d395e074f1)

This Salesforce DX project provides a flexible, metadata-driven solution for dynamically launching Conga Composer from a Lightning Web Component (LWC). Templates and queries are selected based on user-defined picklist values, allowing non-technical users to configure the behavior of Conga Composer via metadata — no Apex or LWC code changes required.

> 📌 **Note**: This LWC does not sit on a specific record page. It lives within a Salesforce tab and uses a **dummy record** to satisfy Conga’s URL requirements.

---

## 📦 What’s Included

- ✅ **Custom Metadata Type**: `CongaBarnTemplate__mdt`  
  Stores mappings between **Barn Names** and **Conga Template IDs** for barn-specific output.

- ✅ **Custom Metadata Type**: `pro_Conga_Settings__mdt`  
  Stores global Conga values including:
  - Dummy Record ID (required for Composer)
  - Default Conga Template ID
  - Conga Query IDs for different product types

- ✅ **Apex Controller**: `CongaBarnTemplateService.cls`  
  A lightweight Apex class used to retrieve the appropriate template based on the selected barn.

- ✅ **Lightning Web Component**  
  - Presents dropdowns for date, barn, and product type.
  - Dynamically constructs the Conga URL based on metadata values and picklist selections.
  - Launches Conga Composer in a new browser tab.

- ✅ **Fallback Support**  
  If no barn-specific template is found, the component defaults to the template from `pro_Conga_Settings__mdt`.

---

## 🧠 Use Case

When a user selects values in the LWC and clicks the Conga button:

1. **Barn Selection**  
   - The LWC reads the selected barn's **label** from the picklist.
   - It searches `CongaBarnTemplate__mdt` for a matching `Barn_Name__c`.
   - If found, the `Template_Id__c` is used; otherwise, it falls back to the default.

2. **Product Type Selection**  
   - If the product type is `'All'`, the query defined as `AllProductsQuery__c` in `pro_Conga_Settings__mdt` is used.
   - If a specific product type is selected (`Conventional`, `Sexed`, `Dairy`), a different query (`BarnQuery__c`) is used and the product type is passed as a parameter.


3. **URL Construction**  
   - Parameters like date, barn ID, and product type are encoded and passed to Conga as `pv0`, `pv1`, and `pv2`.
   - The full Conga Composer URL is built dynamically and opened in a new tab.

---

## 🔧 Metadata Configuration

### `CongaBarnTemplate__mdt` Fields

| Field API Name       | Label           | Description                        |
|----------------------|------------------|------------------------------------|
| `Barn_Name__c`       | Barn Name        | The exact label shown in the UI dropdown |
| `Template_Id__c`     | Template ID      | The Conga Template ID to use       |

### `pro_Conga_Settings__mdt` Fields

| Field API Name        | Label               | Description                                      |
|------------------------|----------------------|--------------------------------------------------|
| `DummyRecord__c`       | Dummy Record ID      | A static Salesforce record used by Conga         |
| `StandardTemplate__c`  | Default Template ID  | The fallback template used if barn match fails   |
| `AllProductsQuery__c`  | All Products Query   | Query used when 'All' is selected for product type |
| `BarnQuery__c`         | Barn Query           | Query used for specific product type selections  |

---


## ✅ Benefits

- 🔧 **Easily configurable** through Metadata Types
- 👨‍💼 **No code changes** needed for new barns or templates
- 🚫 **No dependency** on record pages
- 🔁 **Reusable** for similar LWC-based Conga launchers
- 🔍 **Dynamic logic** for queries and templates based on UI selections

---

