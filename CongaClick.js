import getCongaSettings from '@salesforce/apex/Pro_ModifyProduction_con.getCongaSettings';
import getTemplateIdByBarn  from '@salesforce/apex/Pro_ModifyProduction_con.getTemplateIdByBarn';

connectedCallback() {

    getCongaSettings()
    .then(data => {
        this.congaSettings = data;
    })
    .catch(error => {
        console.error('Error loading Conga settings:', error);
    });
    
}

handleCongaClick() {
        const recordId = this.congaSettings?.DummyRecord;
        let templateId = this.congaSettings?.StandardTemplate;
        const serverUrl = encodeURIComponent(window.location.origin);
        const selectedDate = this.CurrentDate;
        const barnId = this.SelectedBarnId?.value || '';
        const barnName = this.SelectedBarnId?.label;
        const productType = (this.SelectedProductType || '').toLowerCase();
        const isAll = productType === 'all' || productType === '';

        const queryId = isAll 
            ? this.congaSettings?.AllProductsQuery 
            : this.congaSettings?.BarnQuery;

        let pvParams = `pv0=${encodeURIComponent(selectedDate)}~pv1=${encodeURIComponent(barnId)}`;
        if (!isAll) {
            pvParams += `~pv2=${encodeURIComponent(this.SelectedProductType)}`;
        }

        getTemplateIdByBarn({ barnName })
            .then(barnTemplateId => {
                if (barnTemplateId) {
                    templateId = barnTemplateId;
                }

                const congaUrl = `/apex/APXTConga4__Conga_Composer?SolMgr=1` +
                                `&serverUrl=${serverUrl}` +
                                `&id=${recordId}` +
                                `&QueryId=[jr]${queryId}${encodeURIComponent('?' + pvParams)}` +
                                `&TemplateId=${templateId}`;

                window.open(congaUrl, '_blank');
            })
            .catch(error => {
                console.error('Failed to get barn-specific template:', error);
            });
    }
