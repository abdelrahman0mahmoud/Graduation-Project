import { atom } from "recoil";

const textstate = atom({
    key: 'textstate', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

export default textstate;