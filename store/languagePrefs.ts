let _selected: string[] = [];

export function getSelectedLangs(): string[] {
  return _selected;
}

export function setSelectedLangs(langs: string[]) {
  _selected = langs;
}
