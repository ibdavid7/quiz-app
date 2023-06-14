export const scoringOptions = [
    {
        key: '0',
        text: 'Normal Distribution',
        value: 'normal_distribution',
    },
    {
        key: '1',
        text: 'Pass/Fail',
        value: 'pass_fail',
    }
];

export const scoringOptionFields = {
    'normal_distribution': [{ key: 'sd', label: 'Standard Deviation' }, { key: 'mean', label: 'Mean' }],
    'pass_fail': [{ key: 'pass_score', label: 'Pass Score' }, { key: 'sd', label: 'Standard Deviation' }, { key: 'mean', label: 'Mean' }],
};