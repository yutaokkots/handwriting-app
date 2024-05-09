import React from 'react'
import { useTranslation } from 'react-i18next';

const UndoButton: React.FC  = () => {
    const { t } = useTranslation('translation');
    return (
        <div className=""
            aria-label={t("undo-button")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
        </div>

    )
}

export default UndoButton