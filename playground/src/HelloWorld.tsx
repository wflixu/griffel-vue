import { defineComponent } from 'vue';
import { makeStyles } from '../../src';


const useClasses = makeStyles({
    button: { color: 'red' },
    icon: { paddingLeft: '5px' },
});

export const HelloWorld = defineComponent({
    name: 'HelloWorld',
    setup() {
        const classes = useClasses();
        return () => (
            <div>
                <button class={classes.button} >test </button>
                <span class={classes.icon} >textt</span>
            </div>
        );
    },
});