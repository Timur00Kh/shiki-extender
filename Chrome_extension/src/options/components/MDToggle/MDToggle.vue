<template>
    <div class="">
        <input class="toggle_input "
               type="checkbox"
               :id="id"
               style="display:none"
               @change="onChange"
               :checked="checked"
               :disabled="disabled"
        />
        <label :for="id" class="toggle"><span></span></label>
    </div>
</template>

<script>
    export default {
        name: "MDToggle",
        props: {
            checked: Boolean,
            disabled: Boolean,
            onChange: Function,
            label: String
        },
        data () {
            return {
                id: "cbx" + randomInteger(0, 10000)
            }
        }
    }

    function randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }
</script>

<style scoped>
    .toggle {
        position: relative;
        display: block;
        width: 40px;
        height: 20px;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transform: translate3d(0, 0, 0);
    }

    .toggle:before {
        content: "";
        position: relative;
        top: 3px;
        left: 3px;
        width: 34px;
        height: 14px;
        display: block;
        background: #9A9999;
        border-radius: 8px;
        transition: background .2s ease;
    }

    .toggle span {
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        display: block;
        background: white;
        border-radius: 10px;
        box-shadow: 0 3px 8px rgba(154, 153, 153, 0.5);
        transition: all .2s ease;
    }

    .toggle span:before {
        content: "";
        position: absolute;
        display: block;
        margin: -18px;
        width: 56px;
        height: 56px;
        background: rgba(79, 46, 220, 0.5);
        border-radius: 50%;
        transform: scale(0);
        opacity: 1;
        pointer-events: none;
    }

    .toggle_input:checked + .toggle:before {
        background: #76e86b;
    }

    .toggle_input:checked + .toggle span {
        background: #16c173;
        transform: translateX(20px);
        transition: all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25), background 0.15s ease;
        box-shadow: 0 3px 8px rgba(79, 46, 220, 0.2);
    }

    .toggle_input:checked + .toggle span:before {
        transform: scale(1);
        opacity: 0;
        transition: all .4s ease;
    }

    .right-tg-container {
        position: absolute;
        top: calc(50% - 10px);
        left: calc(90% - 20px);
    }

    .tg-container {
        position: absolute;
        top: calc(50% - 10px);
        left: calc(50% - 22px);
    }

    .tg-shine:hover {
        background-color: #FAFAFA;
        transition: background-color 300ms;
    }

    .tg-shine {
        border-color: #ced4da;
        transition: background-color 300ms;
    }

    .paddings {
        padding-right: 10px;
        padding-left: 10px;
    }

    .tg-disabled {
        opacity: 0.6;
    }

</style>