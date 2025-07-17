<template>
    <div>
        <input class="md-checkbox" type="checkbox" :id="id" style="display: none;" @change="onChange" :checked="checked">
        <label :for="id" class="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
        </label>
        <label v-if="label" :for="id">{{label}}</label>
    </div>
</template>

<script>
    export default {
        name: "MDCheckbox",
        props: {
            checked: Boolean,
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
    .check {
        cursor: pointer;
        position: relative;
        margin: auto;
        width: 18px;
        height: 18px;
        -webkit-tap-highlight-color: transparent;
        transform: translate3d(0, 0, 0);
    }

    .check:before {
        content: "";
        position: absolute;
        top: -10px;
        left: -15px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(34,50,84,0.03);
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .check svg {
        position: relative;
        z-index: 1;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: #c8ccd4;
        stroke-width: 1.5;
        transform: translate3d(0, 0, 0);
        stroke-dashoffset: 300;
    }

    .check svg path {
        stroke-dasharray: 60;
        stroke-dashoffset: 0;

    }

    .check svg polyline {
        stroke-dasharray: 22;
        stroke-dashoffset: 66;

    }

    .check:hover:before {
        opacity: 1;
        /*top: 1px;*/
    }

    .check:hover svg {
        stroke: #4285f4;

    }

    .md-checkbox:checked + .check svg {
        stroke: #4285f4;
    }

    .md-checkbox:checked + .check svg path {
        stroke-dashoffset: 60;
        transition: all 0.3s linear;
    }

    .md-checkbox + .check svg path {
        transition: all 0.6s ease;
        transition-delay: 0.15s;
    }

    .md-checkbox:checked + .check svg polyline {
        stroke-dashoffset: 42;
        transition: all 0.2s linear;
        transition-delay: 0.15s;
    }

    .md-checkbox + .check svg polyline {
        transition: all 0.2s linear;
    }

    label {
        display: inline-block;
        margin-bottom: 0 !important;
    }
</style>