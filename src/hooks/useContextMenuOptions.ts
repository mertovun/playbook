export enum ContextMenuOptions {
  OPTION_1 = 'Option 1',
  OPTION_2 = 'Option 2',
  OPTION_3 = 'Option 3',
}

export const useContextMenuOptions = () => {
  const options = [
    ContextMenuOptions.OPTION_1,
    ContextMenuOptions.OPTION_2,
    ContextMenuOptions.OPTION_3,
  ];

  const handleOptionClick = (option: ContextMenuOptions) => {
    switch (option) {
      case ContextMenuOptions.OPTION_1:
        alert('Option 1 clicked!');
        break;
      case ContextMenuOptions.OPTION_2:
        alert('Option 2 clicked!');
        break;
      case ContextMenuOptions.OPTION_3:
        alert('Option 3 clicked!');
        break;
      default:
        break;
    }
  };

  return { options, handleOptionClick };
};
