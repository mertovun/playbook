export enum ContextMenuOptions {
  OPTION_1 = 'Cut',
  OPTION_2 = 'Copy',
  OPTION_3 = 'Paste',
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
