
export const isRegistered = (name: string) => {
  switch (document.createElement(name).constructor.name) {
    case 'HTMLElement': return false;
    case 'HTMLUnknownElement': return false;
  }
  return true;
};
