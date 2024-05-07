import React from 'react';
// import { useTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';

const Recognition:React.FC = () => {
    const { t } = useTranslation('translation');

    return (
        <>
            <div>{t("recognize-button")}</div>
        </>
    )
}

export default Recognition