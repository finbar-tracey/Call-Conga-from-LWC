import getCongaSettings from '@salesforce/apex/Pro_ModifyProduction_con.getCongaSettings';

congaGeneration() {
        const recordId = this.congaSettings?.DummyRecord;
        let templateId = this.congaSettings?.IMVTemplate;
        const queryId = this.congaSettings?.IMVQuery;
        const serverUrl = encodeURIComponent(window.location.origin);

        const selectedIds = this.selectedRecords?.map(record => `'${record.id}'`).join('|') || '';

        if (!recordId || !templateId || !queryId || !selectedIds) {
            console.error('Missing required Conga settings or no selected records.');
            return;
        }

        const pvParams = `pv0=${encodeURIComponent(selectedIds)}`;

        const congaUrl = `/apex/APXTConga4__Conga_Composer?SolMgr=1` +
                        `&serverUrl=${serverUrl}` +
                        `&id=${recordId}` +
                        `&QueryId=[imv]${queryId}${encodeURIComponent('?' + pvParams)}` +
                        `&TemplateId=${templateId}`;

        window.open(congaUrl, '_blank');
    }
