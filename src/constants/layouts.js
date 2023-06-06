export const LayoutValue = {
    mini: {
        question_col: 8,
        answers_col: 8,
        rows_per_answer_col: 2,
    },
    mini_spaced: {
        question_col: 6,
        answers_col: 10,
        rows_per_answer_col: 2,
    },
    compact: {
        question_col: 8,
        answers_col: 8,
        rows_per_answer_col: 1,
    },
    medium: {
        question_col: 16,
        answers_col: 16,
        rows_per_answer_col: 2,
    },
    full: {
        question_col: 16,
        answers_col: 16,
        rows_per_answer_col: 1,
    },
}

const LAYOUTS = [
    {
        key: 'mini',
        text: 'Mini Layout',
        value: 'mini'
      },
      {
        key: 'mini_spaced',
        text: 'Mini Even-Spaced Layout',
        value: 'mini_spaced'
      },
      {
        key: 'compact',
        text: 'Compact Layout',
        value: 'compact'
      },
      {
        key: 'medium',
        text: 'Medium Layout',
        value: 'medium'
      },
      {
        key: 'full',
        text: 'Full Layout',
        value: 'full'
      },
];

export default LAYOUTS;