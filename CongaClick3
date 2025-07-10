handleGenerateBullReport() {

        const recordId = this.congaSettings?.DummyRecord;
        const templateId = this.congaSettings?.BullReportTemplateQuery;
        const primaryQueryId = this.congaSettings?.BullReportQuery;
        const secondaryQueryId = this.congaSettings?.BullReportLineQuery;
        const serverUrl = encodeURIComponent(window.location.origin);

        if (!this.selectedStockRecordIds || this.selectedStockRecordIds.length === 0) {
            this.FireToaster('No Records Selected', 'Please select at least one stock record.', 'warning');
            return;
        }

        const selectedIds = this.selectedStockRecordIds?.map(id => `'${id}'`).join('|') || '';

        if (!templateId || !primaryQueryId || !secondaryQueryId || !recordId) {
            console.error('Missing Conga settings or animal ID');
            return;
        }

        const pvParams = `pv0=${encodeURIComponent(selectedIds)}`;

        const queryIdParam = `[QCQ]${primaryQueryId},[QCSQ]${secondaryQueryId}${encodeURIComponent('?' + pvParams)}`;

        const congaUrl = `/apex/APXTConga4__Conga_Composer?SolMgr=1` +
            `&serverUrl=${serverUrl}` +
            `&Id=${recordId}` +
            `&QueryId=${queryIdParam}` +
            `&TemplateId=${templateId}`;

        window.open(congaUrl, '_blank');

        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: congaUrl
            }
        }).then(url => {
            window.open(url, '_blank');
        });
    }
