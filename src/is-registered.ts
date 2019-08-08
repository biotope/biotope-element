
export const isRegistered = (name: string): boolean => {
  switch (document.createElement(name).constructor) {
    case HTMLElement: return false;
    case HTMLUnknownElement: return false;
    default: return true;
  }
};
