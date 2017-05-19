export const createNode = <type>(id: string, data: type, resist: number, priority: number, cameFrom?: node<type>): node<type> => ({
  id, data, resist, priority,
  cameFrom: cameFrom || null,
  hasBeenRoot: false,
});

export type node<type> = {
  id: string;
  data: type;
  resist: number;
  priority: number;
  cameFrom: node<type> | null;
  hasBeenRoot: boolean;
}