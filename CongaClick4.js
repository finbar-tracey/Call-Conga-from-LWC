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
        const dummyRecordId = this.congaSettings?.DummyRecord;
        let templateId = this.congaSettings?.StandardTemplate;
        const serverUrl = encodeURIComponent(window.location.origin);
        const selectedDate = this.CurrentDate;
        const barnId = this.SelectedBarnId?.value || '';
        const barnName = this.SelectedBarnId?.label;

        // Build pv string once
        const pvParams = `pv0=${encodeURIComponent(selectedDate)}~pv1=${encodeURIComponent(barnId)}`;

        getTemplateIdByBarn({ barnName })
            .then(barnTemplateId => {
                if (barnTemplateId) {
                    templateId = barnTemplateId;
                }

                // Encode "?pv..." once and reuse it
                const encodedPv = encodeURIComponent('?' + pvParams);

                const queryIdParam =
                    `[sexed]0Q_047UA0327609${encodedPv}` +
                    `,[conv]0Q_046UA0379435${encodedPv}` +
                    `,[fresh]0Q_044UA0416079${encodedPv}`;

                const congaUrl =
                    `/apex/APXTConga4__Conga_Composer?SolMgr=1` +
                    `&serverUrl=${serverUrl}` +
                    `&Id=${dummyRecordId}` +
                    `&QueryId=${queryIdParam}` +
                    `&TemplateId=${templateId}`;

                console.log('Conga URL:', congaUrl);
                window.open(congaUrl, '_blank');
            })
            .catch(error => {
                console.error('Failed to get barn-specific template:', error);
            });
    }
