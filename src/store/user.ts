import { atom, useAtom } from "jotai";
import { selectAtom } from "jotai/utils";

type User = {
  fullName: string;
  email: string;
};

const userAtom = atom<User>({
  fullName: "Chanh Dang",
  email: "ncdang@quaric.com",
});

const fullNameAtom = selectAtom(userAtom, (user) => user.fullName);
const emailAtom = selectAtom(userAtom, (user) => user.email);

export function useUser() {
  return useAtom(userAtom);
}

export function useUserFullName() {
  return useAtom(fullNameAtom);
}

export function useUserEmail() {
  return useAtom(emailAtom);
}
