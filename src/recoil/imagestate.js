import { atom } from "recoil";

const imagestate = atom({
    key: 'imagestate', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

export default imagestate;
