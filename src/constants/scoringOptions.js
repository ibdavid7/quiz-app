export const SCORING_OPTIONS = [
    {
        key: '0',
        text: 'Normal Distribution',
        value: 'normal_distribution',
    },
    {
        key: '1',
        text: 'Pass/Fail',
        value: 'pass_fail',
    },
    {
        key: '2',
        text: 'Pass/Fail Normally Distribution',
        value: 'pass_fail_normal_distribution',
    },
];

export const SCORING_OPTION_FIELDS = {
    'normal_distribution':
        [
            {
                key: 'mean', label: 'Mean',
            },
            {
                key: 'sd', label: 'Standard Deviation',
            },
        ],
    'pass_fail':
        [
            {
                key: 'pass_score', label: 'Pass Score',
            },
        ],
    'pass_fail_normal_distribution':
        [
            {
                key: 'pass_score', label: 'Pass Score',
            },
            {
                key: 'mean', label: 'Mean',
            },
            {
                key: 'sd', label: 'Standard Deviation',
            },
        ],
};