<template>
    <div
        class="alert alert-warning"
        :class="{ overlay: mode.overlay, minified: mode.minified }"
        :style="`top: ${drag.position.top}px; right: ${drag.position.right}px`"
        :id="id"
    >
        <div class="pull-right">
            <!--
            <font-awesome-icon
                :icon="maxState ? faSubscript : faSuperscript"
                fixed-width
                @click="toggleMaximum"
            ></font-awesome-icon>
            -->
            <font-awesome-icon
                class="pull-right"
                :icon="mode.overlay ? faAngleDoubleDown : faAngleDoubleUp"
                fixed-width
                @click="toggleOverlay"
            ></font-awesome-icon>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons/faAngleDoubleUp';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons/faArrowsAlt';
import { faCompressAlt } from '@fortawesome/free-solid-svg-icons/faCompressAlt';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons/faExpandAlt';
import { faSubscript } from '@fortawesome/free-solid-svg-icons/faSubscript';
import { faSuperscript } from '@fortawesome/free-solid-svg-icons/faSuperscript';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import { useRootStore } from '@stores/index';

import type {
    MissionHelper,
    MissionHelperComputed,
    MissionHelperMethods,
    MissionHelperProps,
} from 'typings/modules/MissionHelper';

export default Vue.extend<
    MissionHelper,
    MissionHelperMethods,
    MissionHelperComputed,
    MissionHelperProps
>({
    name: 'lssmv4-missionHelper',
    data() {
        return {
            faAngleDoubleDown,
            faAngleDoubleUp,
            faArrowsAlt,
            faCompressAlt,
            faExpandAlt,
            faSubscript,
            faSuperscript,
            faSyncAlt,

            id: useRootStore().nodeAttribute('missionHelper', true),

            mode: {
                overlay: false,
                minified: false,
            },

            drag: {
                active: false,
                position: {
                    top: 60,
                    right: window.innerWidth * 0.03,
                },
                offset: {
                    x: 0,
                    y: 0,
                },
            },
        };
    },
    computed: {
        foo() {
            return 'bar';
        },
    },
    methods: {
        toggleOverlay() {
            this.mode.overlay = !this.mode.overlay;
        },
    },
    props: {
        $m: {
            type: Function,
            required: true,
        },
        $mc: {
            type: Function,
            required: true,
        },
        getSetting: {
            type: Function,
            required: true,
        },
        setSetting: {
            type: Function,
            required: true,
        },
    },
});
</script>

<style lang="sass">
.alert-missing-vehicles:not(.overlay):hover ~ * .overlay
    opacity: 0.1
</style>

<style scoped lang="sass">
.hover-tip
  cursor: pointer

  &:hover
    &+ .alert
      display: block

  &+ .alert
    display: none
    position: absolute
    z-index: 1

.alert

    &.overlay
        z-index: 4
        position: fixed
        top: 3%
        right: 3%
        min-width: 100px
        max-width: calc(100% / 3)
        height: auto
        max-height: calc((100vh - 51.5px - 3%) * 0.97)
        transition: 100ms linear
        margin-bottom: 0.625em

    &.minified
        max-height: 1rem
        min-width: auto

        > div,
        > span
            display: none

    h3
        margin-top: 0 !important

        small
            color: #424242

    .svg-inline--fa
        cursor: pointer
        position: relative
        top: -6px

        &.dragging-field
            cursor: move

    ul:not(.poi-list) li
        list-style: none

        &::before
            content: attr(data-amount)

        @supports selector(li::marker)
            &::before
                content: " "
                white-space: pre
            &::marker
                content: attr(data-amount)

        &.class-x
            &::before
                content: attr(data-amount) "x " !important

            @supports selector(li::marker)
                &::before
                    content: " " !important
                    white-space: pre !important
                &::marker
                    content: attr(data-amount) "x" !important

    .badge
        margin-right: 0.3rem


    .poi-list-toggle
        cursor: pointer

    .poi-list
        display: none

        &.active
            display: block

    .mission-categories
        margin-bottom: 0
</style>
