public with sharing class Pro_ModifyProduction_con {
    @AuraEnabled(cacheable=true)
    public static Map<String, String> getCongaSettings() {
        Map<String, String> result = new Map<String, String>();
        for (pro_Conga_Settings__mdt setting : [SELECT DeveloperName, pro_Value__c FROM pro_Conga_Settings__mdt]) {
            result.put(setting.DeveloperName, setting.pro_Value__c);
        }
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static String getTemplateIdByBarn(String barnName) {
        List<pro_CongaBarnMapping__mdt> results = [
            SELECT pro_Template_Id__c
            FROM pro_CongaBarnMapping__mdt
            WHERE pro_Barn_Name__c = :barnName
            LIMIT 1
        ];
        return results.isEmpty() ? null : results[0].pro_Template_Id__c;
    }
}
