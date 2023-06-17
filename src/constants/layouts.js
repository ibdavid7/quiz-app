export const LayoutValue = {
  mini: {
    grid_cols: 2,
    question_col: 8,
    answers_col: 8,
    cols_per_answer_col: 2,
    answer_subCol: 8,
  },
  mini_spaced: {
    grid_cols: 2,
    question_col: 6,
    answers_col: 10,
    cols_per_answer_col: 2,
    answer_subCol: 8,
  },
  compact: {
    grid_cols: 2,
    question_col: 8,
    answers_col: 8,
    cols_per_answer_col: 1,
    answer_subCol: 16,
  },
  compact_spaced: {
    grid_cols: 2,
    question_col: 6,
    answers_col: 10,
    cols_per_answer_col: 1,
    answer_subCol: 16,
  },
  medium: {
    grid_cols: 1,
    question_col: 16,
    answers_col: 16,
    cols_per_answer_col: 2,
    answer_subCol: 8,
  },
  full: {
    grid_cols: 1,
    question_col: 16,
    answers_col: 16,
    cols_per_answer_col: 1,
    answer_subCol: 16,
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
    key: 'compact_spaced',
    text: 'Compact Even-Spaced Layout',
    value: 'compact_spaced'
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