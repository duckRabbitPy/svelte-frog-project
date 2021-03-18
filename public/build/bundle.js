
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function blur(node, { delay = 0, duration = 400, easing = cubicInOut, amount = 5, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const f = style.filter === 'none' ? '' : style.filter;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `opacity: ${target_opacity - (od * u)}; filter: ${f} blur(${u * amount}px);`
        };
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src/UI/Header.svelte generated by Svelte v3.35.0 */
    const file$p = "src/UI/Header.svelte";

    function create_fragment$q(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Adopt a Frog";
    			t1 = space();
    			img = element("img");
    			attr_dev(h1, "class", "wiggle svelte-atmtlo");
    			add_location(h1, file$p, 48, 4, 884);
    			if (img.src !== (img_src_value = "/images/frog.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "frog");
    			attr_dev(img, "width", "60rem");
    			attr_dev(img, "class", "svelte-atmtlo");
    			add_location(img, file$p, 49, 4, 925);
    			attr_dev(header, "class", "svelte-atmtlo");
    			add_location(header, file$p, 47, 0, 871);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, img);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fly });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const darkModeOn = writable(false);

    /* src/UI/Social.svelte generated by Svelte v3.35.0 */
    const file$o = "src/UI/Social.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let p;
    	let span;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let button;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			span = element("span");
    			img = element("img");
    			t0 = text(/*counterName*/ ctx[0]);
    			t1 = space();
    			button = element("button");
    			t2 = text(/*likeStatus*/ ctx[2]);
    			if (img.src !== (img_src_value = "/images/frog.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "frog");
    			attr_dev(img, "width", "40rem");
    			add_location(img, file$o, 35, 13, 639);
    			add_location(span, file$o, 35, 7, 633);
    			attr_dev(p, "class", "svelte-4vhr8g");
    			add_location(p, file$o, 35, 4, 630);
    			button.disabled = /*disabled*/ ctx[1];
    			attr_dev(button, "class", "svelte-4vhr8g");
    			add_location(button, file$o, 36, 4, 721);
    			add_location(div, file$o, 34, 0, 620);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, span);
    			append_dev(span, img);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*numOfClicks*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*counterName*/ 1) set_data_dev(t0, /*counterName*/ ctx[0]);
    			if (dirty & /*likeStatus*/ 4) set_data_dev(t2, /*likeStatus*/ ctx[2]);

    			if (dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Social", slots, []);
    	let { counterName } = $$props;
    	let { disabled } = $$props;
    	let likeStatus = "like";
    	let num = 0;
    	const dispatch = createEventDispatcher();

    	function numOfClicks() {
    		num += 1;
    		$$invalidate(2, likeStatus = "liked!");
    		dispatch("pass-up-data", num);
    	}

    	const writable_props = ["counterName", "disabled"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Social> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("counterName" in $$props) $$invalidate(0, counterName = $$props.counterName);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    	};

    	$$self.$capture_state = () => ({
    		counterName,
    		disabled,
    		createEventDispatcher,
    		likeStatus,
    		num,
    		dispatch,
    		numOfClicks
    	});

    	$$self.$inject_state = $$props => {
    		if ("counterName" in $$props) $$invalidate(0, counterName = $$props.counterName);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("likeStatus" in $$props) $$invalidate(2, likeStatus = $$props.likeStatus);
    		if ("num" in $$props) num = $$props.num;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [counterName, disabled, likeStatus, numOfClicks];
    }

    class Social extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { counterName: 0, disabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*counterName*/ ctx[0] === undefined && !("counterName" in props)) {
    			console.warn("<Social> was created without expected prop 'counterName'");
    		}

    		if (/*disabled*/ ctx[1] === undefined && !("disabled" in props)) {
    			console.warn("<Social> was created without expected prop 'disabled'");
    		}
    	}

    	get counterName() {
    		throw new Error("<Social>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set counterName(value) {
    		throw new Error("<Social>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Social>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Social>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/CustomButton.svelte generated by Svelte v3.35.0 */

    const file$n = "src/UI/CustomButton.svelte";

    function create_fragment$o(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*stateColour*/ ctx[1]) + " svelte-1rx2z7j"));
    			attr_dev(button, "type", /*btntype*/ ctx[0]);
    			button.disabled = /*disabled*/ ctx[2];
    			add_location(button, file$n, 105, 0, 1697);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*stateColour*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*stateColour*/ ctx[1]) + " svelte-1rx2z7j"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*btntype*/ 1) {
    				attr_dev(button, "type", /*btntype*/ ctx[0]);
    			}

    			if (!current || dirty & /*disabled*/ 4) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CustomButton", slots, ['default']);
    	let { btntype } = $$props;
    	let { stateColour = null } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ["btntype", "stateColour", "disabled"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CustomButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("btntype" in $$props) $$invalidate(0, btntype = $$props.btntype);
    		if ("stateColour" in $$props) $$invalidate(1, stateColour = $$props.stateColour);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ btntype, stateColour, disabled });

    	$$self.$inject_state = $$props => {
    		if ("btntype" in $$props) $$invalidate(0, btntype = $$props.btntype);
    		if ("stateColour" in $$props) $$invalidate(1, stateColour = $$props.stateColour);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [btntype, stateColour, disabled, $$scope, slots, click_handler];
    }

    class CustomButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { btntype: 0, stateColour: 1, disabled: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomButton",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*btntype*/ ctx[0] === undefined && !("btntype" in props)) {
    			console.warn("<CustomButton> was created without expected prop 'btntype'");
    		}
    	}

    	get btntype() {
    		throw new Error("<CustomButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btntype(value) {
    		throw new Error("<CustomButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stateColour() {
    		throw new Error("<CustomButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stateColour(value) {
    		throw new Error("<CustomButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CustomButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CustomButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/Badge.svelte generated by Svelte v3.35.0 */
    const file$m = "src/UI/Badge.svelte";

    function create_fragment$n(ctx) {
    	let span;
    	let span_transition;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-1cff2fk");
    			add_location(span, file$m, 17, 0, 331);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!span_transition) span_transition = create_bidirectional_transition(span, slide, {}, true);
    				span_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!span_transition) span_transition = create_bidirectional_transition(span, slide, {}, false);
    			span_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && span_transition) span_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Badge", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Badge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ slide });
    	return [$$scope, slots];
    }

    class Badge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Badge",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/Adoption/AdoptItem.svelte generated by Svelte v3.35.0 */

    const { Error: Error_1$2, Object: Object_1$1, console: console_1$2 } = globals;
    const file$l = "src/Adoption/AdoptItem.svelte";

    // (167:6) {#if isFavItem}
    function create_if_block$8(ctx) {
    	let badge;
    	let current;

    	badge = new Badge({
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(badge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(badge, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(badge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(badge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(badge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(167:6) {#if isFavItem}",
    		ctx
    	});

    	return block;
    }

    // (168:8) <Badge>
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Saved to favourites!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(168:8) <Badge>",
    		ctx
    	});

    	return block;
    }

    // (176:8) <CustomButton on:click={() => dispatch('adopt-event')} btntype="submit">
    function create_default_slot_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Adopt!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(176:8) <CustomButton on:click={() => dispatch('adopt-event')} btntype=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (177:8) <CustomButton on:click={() => dispatch('toggle-favourite', id)} btntype="submit" stateColour="{isFavItem ? null : "success"}">
    function create_default_slot$a(ctx) {
    	let t_value = (/*isFavItem*/ ctx[7]
    	? "Remove from favourites"
    	: "Add to favourites") + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isFavItem*/ 128 && t_value !== (t_value = (/*isFavItem*/ ctx[7]
    			? "Remove from favourites"
    			: "Add to favourites") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(177:8) <CustomButton on:click={() => dispatch('toggle-favourite', id)} btntype=\\\"submit\\\" stateColour=\\\"{isFavItem ? null : \\\"success\\\"}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let article;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let p0;
    	let t4;
    	let t5;
    	let t6;
    	let div0;
    	let img;
    	let img_src_value;
    	let t7;
    	let div1;
    	let t8;
    	let div2;
    	let p1;
    	let t9;
    	let t10;
    	let footer;
    	let a;
    	let t11;
    	let a_href_value;
    	let t12;
    	let custombutton0;
    	let t13;
    	let custombutton1;
    	let t14;
    	let social;
    	let article_class_value;
    	let article_intro;
    	let current;
    	let if_block = /*isFavItem*/ ctx[7] && create_if_block$8(ctx);

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*click_handler*/ ctx[14]);

    	custombutton1 = new CustomButton({
    			props: {
    				btntype: "submit",
    				stateColour: /*isFavItem*/ ctx[7] ? null : "success",
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*click_handler_1*/ ctx[15]);

    	social = new Social({
    			props: {
    				disabled: /*disabled*/ ctx[9],
    				counterName: "Likes " + /*likes*/ ctx[8]
    			},
    			$$inline: true
    		});

    	social.$on("pass-up-data", /*saveLikesFb*/ ctx[13]);
    	social.$on("pass-up-data", /*captureCustomEventData*/ ctx[12]);

    	const block = {
    		c: function create() {
    			article = element("article");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*subtitle*/ ctx[2]);
    			t3 = space();
    			p0 = element("p");
    			t4 = text("Location: ");
    			t5 = text(/*address*/ ctx[5]);
    			t6 = space();
    			div0 = element("div");
    			img = element("img");
    			t7 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t8 = space();
    			div2 = element("div");
    			p1 = element("p");
    			t9 = text(/*description*/ ctx[4]);
    			t10 = space();
    			footer = element("footer");
    			a = element("a");
    			t11 = text("Contact");
    			t12 = space();
    			create_component(custombutton0.$$.fragment);
    			t13 = space();
    			create_component(custombutton1.$$.fragment);
    			t14 = space();
    			create_component(social.$$.fragment);
    			attr_dev(h1, "class", "svelte-1826xxk");
    			add_location(h1, file$l, 157, 8, 3032);
    			attr_dev(h2, "class", "svelte-1826xxk");
    			add_location(h2, file$l, 159, 8, 3066);
    			attr_dev(p0, "class", "svelte-1826xxk");
    			add_location(p0, file$l, 160, 8, 3094);
    			attr_dev(header, "class", "svelte-1826xxk");
    			add_location(header, file$l, 156, 4, 3015);
    			if (img.src !== (img_src_value = /*imageUrl*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1826xxk");
    			add_location(img, file$l, 163, 8, 3167);
    			attr_dev(div0, "class", "image svelte-1826xxk");
    			add_location(div0, file$l, 162, 4, 3139);
    			attr_dev(div1, "class", "badge svelte-1826xxk");
    			add_location(div1, file$l, 165, 4, 3213);
    			attr_dev(p1, "class", "svelte-1826xxk");
    			add_location(p1, file$l, 171, 8, 3356);
    			attr_dev(div2, "class", "content svelte-1826xxk");
    			add_location(div2, file$l, 170, 4, 3326);
    			attr_dev(a, "href", a_href_value = "mailto:" + /*email*/ ctx[6]);
    			add_location(a, file$l, 174, 8, 3409);
    			attr_dev(footer, "class", "svelte-1826xxk");
    			add_location(footer, file$l, 173, 4, 3392);
    			attr_dev(article, "class", article_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[10] ? "darkMode" : "lightMode") + " svelte-1826xxk"));
    			add_location(article, file$l, 155, 0, 2944);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$2("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(header, t1);
    			append_dev(header, h2);
    			append_dev(h2, t2);
    			append_dev(header, t3);
    			append_dev(header, p0);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(article, t6);
    			append_dev(article, div0);
    			append_dev(div0, img);
    			append_dev(article, t7);
    			append_dev(article, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(article, t8);
    			append_dev(article, div2);
    			append_dev(div2, p1);
    			append_dev(p1, t9);
    			append_dev(article, t10);
    			append_dev(article, footer);
    			append_dev(footer, a);
    			append_dev(a, t11);
    			append_dev(footer, t12);
    			mount_component(custombutton0, footer, null);
    			append_dev(footer, t13);
    			mount_component(custombutton1, footer, null);
    			append_dev(footer, t14);
    			mount_component(social, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);
    			if (!current || dirty & /*subtitle*/ 4) set_data_dev(t2, /*subtitle*/ ctx[2]);
    			if (!current || dirty & /*address*/ 32) set_data_dev(t5, /*address*/ ctx[5]);

    			if (!current || dirty & /*imageUrl*/ 8 && img.src !== (img_src_value = /*imageUrl*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (/*isFavItem*/ ctx[7]) {
    				if (if_block) {
    					if (dirty & /*isFavItem*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*description*/ 16) set_data_dev(t9, /*description*/ ctx[4]);

    			if (!current || dirty & /*email*/ 64 && a_href_value !== (a_href_value = "mailto:" + /*email*/ ctx[6])) {
    				attr_dev(a, "href", a_href_value);
    			}

    			const custombutton0_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};
    			if (dirty & /*isFavItem*/ 128) custombutton1_changes.stateColour = /*isFavItem*/ ctx[7] ? null : "success";

    			if (dirty & /*$$scope, isFavItem*/ 262272) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);
    			const social_changes = {};
    			if (dirty & /*disabled*/ 512) social_changes.disabled = /*disabled*/ ctx[9];
    			if (dirty & /*likes*/ 256) social_changes.counterName = "Likes " + /*likes*/ ctx[8];
    			social.$set(social_changes);

    			if (!current || dirty & /*$darkModeOn*/ 1024 && article_class_value !== (article_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[10] ? "darkMode" : "lightMode") + " svelte-1826xxk"))) {
    				attr_dev(article, "class", article_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(custombutton0.$$.fragment, local);
    			transition_in(custombutton1.$$.fragment, local);
    			transition_in(social.$$.fragment, local);

    			if (!article_intro) {
    				add_render_callback(() => {
    					article_intro = create_in_transition(article, fade, {});
    					article_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(custombutton0.$$.fragment, local);
    			transition_out(custombutton1.$$.fragment, local);
    			transition_out(social.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block) if_block.d();
    			destroy_component(custombutton0);
    			destroy_component(custombutton1);
    			destroy_component(social);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(10, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AdoptItem", slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let { subtitle } = $$props;
    	let { imageUrl } = $$props;
    	let { description } = $$props;
    	let { address } = $$props;
    	let { email } = $$props;
    	let { isFavItem } = $$props;
    	let likes = 0;
    	let stateOfLikes;
    	let disabled = false;
    	const dispatch = createEventDispatcher();

    	function captureCustomEventData(event) {
    		//can access data up from your custom event from detail property 
    		$$invalidate(8, likes += event.detail);
    	}

    	function shareLikeState() {
    		dispatch("share-like", stateOfLikes);
    	}

    	//GET is default if not specified
    	fetch("https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/id.json").then(res => {
    		if (!res.ok) {
    			throw new Error("Get request failed");
    		}

    		return res.json();
    	}).then(data => {
    		stateOfLikes = data;
    		$$invalidate(8, likes = stateOfLikes[id]);
    	}).catch(err => {
    		console.log(err);
    	});

    	function saveLikesFb() {
    		//unpack into an Array
    		let ObArr = Object.entries(stateOfLikes);

    		let newObj = {};

    		for (let x = 0; x < ObArr.length; x++) {
    			//if selected frog id matches firestore id, increment by 1
    			//then add to object
    			if (ObArr[x][0] === id) {
    				newObj[ObArr[x][0]] = Number(ObArr[x][1]) + 1;
    			} else {
    				newObj[ObArr[x][0]] = Number(ObArr[x][1]);
    			}
    		}

    		$$invalidate(9, disabled = true);

    		fetch(`https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/id.json`, {
    			method: "PUT",
    			body: JSON.stringify(newObj),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			if (!res.ok) {
    				throw new Error("Put request failed");
    			}
    		}).catch(err => {
    			console.log(err); //space for further data manipulatin
    		});
    	}

    	const writable_props = [
    		"id",
    		"title",
    		"subtitle",
    		"imageUrl",
    		"description",
    		"address",
    		"email",
    		"isFavItem"
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<AdoptItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("adopt-event");
    	const click_handler_1 = () => dispatch("toggle-favourite", id);

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ("imageUrl" in $$props) $$invalidate(3, imageUrl = $$props.imageUrl);
    		if ("description" in $$props) $$invalidate(4, description = $$props.description);
    		if ("address" in $$props) $$invalidate(5, address = $$props.address);
    		if ("email" in $$props) $$invalidate(6, email = $$props.email);
    		if ("isFavItem" in $$props) $$invalidate(7, isFavItem = $$props.isFavItem);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		darkModeOn,
    		fade,
    		Social,
    		id,
    		title,
    		subtitle,
    		imageUrl,
    		description,
    		address,
    		email,
    		isFavItem,
    		likes,
    		stateOfLikes,
    		disabled,
    		CustomButton,
    		Badge,
    		dispatch,
    		captureCustomEventData,
    		shareLikeState,
    		saveLikesFb,
    		$darkModeOn
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ("imageUrl" in $$props) $$invalidate(3, imageUrl = $$props.imageUrl);
    		if ("description" in $$props) $$invalidate(4, description = $$props.description);
    		if ("address" in $$props) $$invalidate(5, address = $$props.address);
    		if ("email" in $$props) $$invalidate(6, email = $$props.email);
    		if ("isFavItem" in $$props) $$invalidate(7, isFavItem = $$props.isFavItem);
    		if ("likes" in $$props) $$invalidate(8, likes = $$props.likes);
    		if ("stateOfLikes" in $$props) stateOfLikes = $$props.stateOfLikes;
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		title,
    		subtitle,
    		imageUrl,
    		description,
    		address,
    		email,
    		isFavItem,
    		likes,
    		disabled,
    		$darkModeOn,
    		dispatch,
    		captureCustomEventData,
    		saveLikesFb,
    		click_handler,
    		click_handler_1
    	];
    }

    class AdoptItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			id: 0,
    			title: 1,
    			subtitle: 2,
    			imageUrl: 3,
    			description: 4,
    			address: 5,
    			email: 6,
    			isFavItem: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdoptItem",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'id'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'title'");
    		}

    		if (/*subtitle*/ ctx[2] === undefined && !("subtitle" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'subtitle'");
    		}

    		if (/*imageUrl*/ ctx[3] === undefined && !("imageUrl" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'imageUrl'");
    		}

    		if (/*description*/ ctx[4] === undefined && !("description" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'description'");
    		}

    		if (/*address*/ ctx[5] === undefined && !("address" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'address'");
    		}

    		if (/*email*/ ctx[6] === undefined && !("email" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'email'");
    		}

    		if (/*isFavItem*/ ctx[7] === undefined && !("isFavItem" in props)) {
    			console_1$2.warn("<AdoptItem> was created without expected prop 'isFavItem'");
    		}
    	}

    	get id() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageUrl() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageUrl(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get address() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set address(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFavItem() {
    		throw new Error_1$2("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFavItem(value) {
    		throw new Error_1$2("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Adoption/AdoptGrid.svelte generated by Svelte v3.35.0 */
    const file$k = "src/Adoption/AdoptGrid.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (23:4) {#each frogs as frog}
    function create_each_block$6(ctx) {
    	let adoptitem;
    	let current;

    	adoptitem = new AdoptItem({
    			props: {
    				title: /*frog*/ ctx[3].title,
    				subtitle: /*frog*/ ctx[3].subtitle,
    				description: /*frog*/ ctx[3].description,
    				imageUrl: /*frog*/ ctx[3].imageUrl,
    				address: /*frog*/ ctx[3].address,
    				email: /*frog*/ ctx[3].contact,
    				isFavItem: /*frog*/ ctx[3].isFavourite,
    				id: /*frog*/ ctx[3].id
    			},
    			$$inline: true
    		});

    	adoptitem.$on("toggle-favourite", /*toggle_favourite_handler*/ ctx[1]);
    	adoptitem.$on("adopt-event", /*adopt_event_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(adoptitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(adoptitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const adoptitem_changes = {};
    			if (dirty & /*frogs*/ 1) adoptitem_changes.title = /*frog*/ ctx[3].title;
    			if (dirty & /*frogs*/ 1) adoptitem_changes.subtitle = /*frog*/ ctx[3].subtitle;
    			if (dirty & /*frogs*/ 1) adoptitem_changes.description = /*frog*/ ctx[3].description;
    			if (dirty & /*frogs*/ 1) adoptitem_changes.imageUrl = /*frog*/ ctx[3].imageUrl;
    			if (dirty & /*frogs*/ 1) adoptitem_changes.address = /*frog*/ ctx[3].address;
    			if (dirty & /*frogs*/ 1) adoptitem_changes.email = /*frog*/ ctx[3].contact;
    			if (dirty & /*frogs*/ 1) adoptitem_changes.isFavItem = /*frog*/ ctx[3].isFavourite;
    			if (dirty & /*frogs*/ 1) adoptitem_changes.id = /*frog*/ ctx[3].id;
    			adoptitem.$set(adoptitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(adoptitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(adoptitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(adoptitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(23:4) {#each frogs as frog}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let section;
    	let current;
    	let each_value = /*frogs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "id", "frogs");
    			attr_dev(section, "class", "svelte-en9a7l");
    			add_location(section, file$k, 21, 0, 290);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*frogs*/ 1) {
    				each_value = /*frogs*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AdoptGrid", slots, []);
    	let { frogs } = $$props;
    	const writable_props = ["frogs"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AdoptGrid> was created with unknown prop '${key}'`);
    	});

    	function toggle_favourite_handler(event) {
    		bubble($$self, event);
    	}

    	function adopt_event_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("frogs" in $$props) $$invalidate(0, frogs = $$props.frogs);
    	};

    	$$self.$capture_state = () => ({ AdoptItem, frogs });

    	$$self.$inject_state = $$props => {
    		if ("frogs" in $$props) $$invalidate(0, frogs = $$props.frogs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [frogs, toggle_favourite_handler, adopt_event_handler];
    }

    class AdoptGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { frogs: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdoptGrid",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*frogs*/ ctx[0] === undefined && !("frogs" in props)) {
    			console.warn("<AdoptGrid> was created without expected prop 'frogs'");
    		}
    	}

    	get frogs() {
    		throw new Error("<AdoptGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set frogs(value) {
    		throw new Error("<AdoptGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/TextInput.svelte generated by Svelte v3.35.0 */

    const file$j = "src/UI/TextInput.svelte";

    // (68:0) {:else}
    function create_else_block$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", /*Id*/ ctx[1]);
    			input.value = /*value*/ ctx[4];
    			attr_dev(input, "class", "svelte-8lwa8w");
    			toggle_class(input, "invalid", !/*valid*/ ctx[5] && /*touched*/ ctx[7]);
    			add_location(input, file$j, 68, 4, 1234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler_1*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Id*/ 2) {
    				attr_dev(input, "id", /*Id*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 16 && input.value !== /*value*/ ctx[4]) {
    				prop_dev(input, "value", /*value*/ ctx[4]);
    			}

    			if (dirty & /*valid, touched*/ 160) {
    				toggle_class(input, "invalid", !/*valid*/ ctx[5] && /*touched*/ ctx[7]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(68:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:0) {#if controlType === "textarea"}
    function create_if_block_1$4(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "rows", /*rows*/ ctx[3]);
    			attr_dev(textarea, "id", /*Id*/ ctx[1]);
    			textarea.value = /*value*/ ctx[4];
    			attr_dev(textarea, "class", "svelte-8lwa8w");
    			toggle_class(textarea, "invalid", !/*valid*/ ctx[5] && /*touched*/ ctx[7]);
    			add_location(textarea, file$j, 66, 4, 1115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*input_handler*/ ctx[8], false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows*/ 8) {
    				attr_dev(textarea, "rows", /*rows*/ ctx[3]);
    			}

    			if (dirty & /*Id*/ 2) {
    				attr_dev(textarea, "id", /*Id*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 16) {
    				prop_dev(textarea, "value", /*value*/ ctx[4]);
    			}

    			if (dirty & /*valid, touched*/ 160) {
    				toggle_class(textarea, "invalid", !/*valid*/ ctx[5] && /*touched*/ ctx[7]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(63:0) {#if controlType === \\\"textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if validityMessage && !valid}
    function create_if_block$7(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*validityMessage*/ ctx[6]);
    			attr_dev(p, "class", "error-message svelte-8lwa8w");
    			add_location(p, file$j, 71, 0, 1351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*validityMessage*/ 64) set_data_dev(t, /*validityMessage*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(71:0) {#if validityMessage && !valid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let label_1;
    	let t0;
    	let t1;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (/*controlType*/ ctx[0] === "textarea") return create_if_block_1$4;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*validityMessage*/ ctx[6] && !/*valid*/ ctx[5] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[2]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(label_1, "for", /*Id*/ ctx[1]);
    			attr_dev(label_1, "class", "svelte-8lwa8w");
    			add_location(label_1, file$j, 61, 4, 882);
    			attr_dev(div, "class", "form-control svelte-8lwa8w");
    			add_location(div, file$j, 60, 0, 851);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label_1);
    			append_dev(label_1, t0);
    			append_dev(div, t1);
    			if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 4) set_data_dev(t0, /*label*/ ctx[2]);

    			if (dirty & /*Id*/ 2) {
    				attr_dev(label_1, "for", /*Id*/ ctx[1]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			}

    			if (/*validityMessage*/ ctx[6] && !/*valid*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TextInput", slots, []);
    	let { controlType = null } = $$props;
    	let { Id } = $$props;
    	let { label } = $$props;
    	let { rows = null } = $$props;
    	let { value } = $$props;
    	let { valid } = $$props;
    	let { validityMessage } = $$props;
    	let touched = false;
    	const writable_props = ["controlType", "Id", "label", "rows", "value", "valid", "validityMessage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextInput> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler_1(event) {
    		bubble($$self, event);
    	}

    	const blur_handler = () => $$invalidate(7, touched = true);

    	$$self.$$set = $$props => {
    		if ("controlType" in $$props) $$invalidate(0, controlType = $$props.controlType);
    		if ("Id" in $$props) $$invalidate(1, Id = $$props.Id);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("rows" in $$props) $$invalidate(3, rows = $$props.rows);
    		if ("value" in $$props) $$invalidate(4, value = $$props.value);
    		if ("valid" in $$props) $$invalidate(5, valid = $$props.valid);
    		if ("validityMessage" in $$props) $$invalidate(6, validityMessage = $$props.validityMessage);
    	};

    	$$self.$capture_state = () => ({
    		controlType,
    		Id,
    		label,
    		rows,
    		value,
    		valid,
    		validityMessage,
    		touched
    	});

    	$$self.$inject_state = $$props => {
    		if ("controlType" in $$props) $$invalidate(0, controlType = $$props.controlType);
    		if ("Id" in $$props) $$invalidate(1, Id = $$props.Id);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("rows" in $$props) $$invalidate(3, rows = $$props.rows);
    		if ("value" in $$props) $$invalidate(4, value = $$props.value);
    		if ("valid" in $$props) $$invalidate(5, valid = $$props.valid);
    		if ("validityMessage" in $$props) $$invalidate(6, validityMessage = $$props.validityMessage);
    		if ("touched" in $$props) $$invalidate(7, touched = $$props.touched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		controlType,
    		Id,
    		label,
    		rows,
    		value,
    		valid,
    		validityMessage,
    		touched,
    		input_handler,
    		input_handler_1,
    		blur_handler
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			controlType: 0,
    			Id: 1,
    			label: 2,
    			rows: 3,
    			value: 4,
    			valid: 5,
    			validityMessage: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*Id*/ ctx[1] === undefined && !("Id" in props)) {
    			console.warn("<TextInput> was created without expected prop 'Id'");
    		}

    		if (/*label*/ ctx[2] === undefined && !("label" in props)) {
    			console.warn("<TextInput> was created without expected prop 'label'");
    		}

    		if (/*value*/ ctx[4] === undefined && !("value" in props)) {
    			console.warn("<TextInput> was created without expected prop 'value'");
    		}

    		if (/*valid*/ ctx[5] === undefined && !("valid" in props)) {
    			console.warn("<TextInput> was created without expected prop 'valid'");
    		}

    		if (/*validityMessage*/ ctx[6] === undefined && !("validityMessage" in props)) {
    			console.warn("<TextInput> was created without expected prop 'validityMessage'");
    		}
    	}

    	get controlType() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlType(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Id() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Id(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validityMessage() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validityMessage(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/Modal.svelte generated by Svelte v3.35.0 */
    const file$i = "src/UI/Modal.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    // (73:6) <CustomButton on:click="{closeModel}">
    function create_default_slot$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(73:6) <CustomButton on:click=\\\"{closeModel}\\\">",
    		ctx
    	});

    	return block;
    }

    // (72:24)        
    function fallback_block$1(ctx) {
    	let custombutton;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton.$on("click", /*closeModel*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(custombutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(custombutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				custombutton_changes.$$scope = { dirty, ctx };
    			}

    			custombutton.$set(custombutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(custombutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(72:24)        ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div0;
    	let div0_transition;
    	let t0;
    	let div2;
    	let h1;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let footer;
    	let div2_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	const footer_slot_template = /*#slots*/ ctx[2].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[3], get_footer_slot_context);
    	const footer_slot_or_fallback = footer_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t3 = space();
    			footer = element("footer");
    			if (footer_slot_or_fallback) footer_slot_or_fallback.c();
    			attr_dev(div0, "class", "modal-backdrop svelte-ujtzar");
    			add_location(div0, file$i, 64, 0, 1021);
    			attr_dev(h1, "class", "svelte-ujtzar");
    			add_location(h1, file$i, 66, 4, 1142);
    			attr_dev(div1, "class", "content svelte-ujtzar");
    			add_location(div1, file$i, 67, 4, 1163);
    			attr_dev(footer, "class", "svelte-ujtzar");
    			add_location(footer, file$i, 70, 4, 1217);
    			attr_dev(div2, "class", "modal svelte-ujtzar");
    			add_location(div2, file$i, 65, 0, 1091);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, footer);

    			if (footer_slot_or_fallback) {
    				footer_slot_or_fallback.m(footer, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*closeModel*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(footer_slot, footer_slot_template, ctx, /*$$scope*/ ctx[3], dirty, get_footer_slot_changes, get_footer_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, true);
    				div0_transition.run(1);
    			});

    			transition_in(default_slot, local);
    			transition_in(footer_slot_or_fallback, local);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 300 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, false);
    			div0_transition.run(0);
    			transition_out(default_slot, local);
    			transition_out(footer_slot_or_fallback, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 300 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (footer_slot_or_fallback) footer_slot_or_fallback.d(detaching);
    			if (detaching && div2_transition) div2_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, ['default','footer']);
    	let { title } = $$props;
    	const dispatch = createEventDispatcher();

    	function closeModel() {
    		dispatch("cancel");
    	}

    	const writable_props = ["title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		CustomButton,
    		createEventDispatcher,
    		fly,
    		fade,
    		title,
    		dispatch,
    		closeModel
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, closeModel, slots, $$scope];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Modal> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isEmpty(val) {
        return val.trim().length === 0;
    }

    function validateUrl(value) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
      }

    /* src/Adoption/EditAdopt.svelte generated by Svelte v3.35.0 */

    const { console: console_1$1 } = globals;
    const file$h = "src/Adoption/EditAdopt.svelte";

    // (52:4) <Modal title="Re-home Form" on:cancel>
    function create_default_slot_2$2(ctx) {
    	let form;
    	let textinput0;
    	let t0;
    	let textinput1;
    	let t1;
    	let textinput2;
    	let t2;
    	let textinput3;
    	let t3;
    	let textinput4;
    	let t4;
    	let textinput5;
    	let form_intro;
    	let current;
    	let mounted;
    	let dispose;

    	textinput0 = new TextInput({
    			props: {
    				Id: "title",
    				label: "Name",
    				controlType: "",
    				rows: "",
    				value: /*title*/ ctx[0],
    				valid: /*titleValid*/ ctx[1],
    				validityMessage: "Enter your frog's name"
    			},
    			$$inline: true
    		});

    	textinput0.$on("input", /*input_handler*/ ctx[12]);

    	textinput1 = new TextInput({
    			props: {
    				Id: "subtitle",
    				label: "Species",
    				controlType: "",
    				rows: "",
    				value: /*subtitle*/ ctx[6]
    			},
    			$$inline: true
    		});

    	textinput1.$on("input", /*input_handler_1*/ ctx[13]);

    	textinput2 = new TextInput({
    			props: {
    				Id: "description",
    				label: "Description",
    				controlType: "textarea",
    				rows: "4",
    				valid: /*descriptionValid*/ ctx[5],
    				value: /*description*/ ctx[2]
    			},
    			$$inline: true
    		});

    	textinput2.$on("input", /*input_handler_2*/ ctx[14]);

    	textinput3 = new TextInput({
    			props: {
    				Id: "imageUrL",
    				label: "ImageUrl",
    				controlType: "",
    				rows: "",
    				valid: /*urlValid*/ ctx[4],
    				validityMessage: "Must enter valid URL",
    				value: /*imageUrl*/ ctx[3]
    			},
    			$$inline: true
    		});

    	textinput3.$on("input", /*input_handler_3*/ ctx[15]);

    	textinput4 = new TextInput({
    			props: {
    				Id: "address",
    				label: "Address",
    				controlType: "",
    				rows: "",
    				value: /*address*/ ctx[7]
    			},
    			$$inline: true
    		});

    	textinput4.$on("input", /*input_handler_4*/ ctx[16]);

    	textinput5 = new TextInput({
    			props: {
    				Id: "contact",
    				label: "E-mail",
    				controlType: "",
    				rows: "",
    				value: /*contact*/ ctx[8]
    			},
    			$$inline: true
    		});

    	textinput5.$on("input", /*input_handler_5*/ ctx[17]);

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(textinput0.$$.fragment);
    			t0 = space();
    			create_component(textinput1.$$.fragment);
    			t1 = space();
    			create_component(textinput2.$$.fragment);
    			t2 = space();
    			create_component(textinput3.$$.fragment);
    			t3 = space();
    			create_component(textinput4.$$.fragment);
    			t4 = space();
    			create_component(textinput5.$$.fragment);
    			attr_dev(form, "class", "svelte-xg754s");
    			add_location(form, file$h, 52, 4, 1151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(textinput0, form, null);
    			append_dev(form, t0);
    			mount_component(textinput1, form, null);
    			append_dev(form, t1);
    			mount_component(textinput2, form, null);
    			append_dev(form, t2);
    			mount_component(textinput3, form, null);
    			append_dev(form, t3);
    			mount_component(textinput4, form, null);
    			append_dev(form, t4);
    			mount_component(textinput5, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submitForm*/ ctx[10]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const textinput0_changes = {};
    			if (dirty & /*title*/ 1) textinput0_changes.value = /*title*/ ctx[0];
    			if (dirty & /*titleValid*/ 2) textinput0_changes.valid = /*titleValid*/ ctx[1];
    			textinput0.$set(textinput0_changes);
    			const textinput1_changes = {};
    			if (dirty & /*subtitle*/ 64) textinput1_changes.value = /*subtitle*/ ctx[6];
    			textinput1.$set(textinput1_changes);
    			const textinput2_changes = {};
    			if (dirty & /*descriptionValid*/ 32) textinput2_changes.valid = /*descriptionValid*/ ctx[5];
    			if (dirty & /*description*/ 4) textinput2_changes.value = /*description*/ ctx[2];
    			textinput2.$set(textinput2_changes);
    			const textinput3_changes = {};
    			if (dirty & /*urlValid*/ 16) textinput3_changes.valid = /*urlValid*/ ctx[4];
    			if (dirty & /*imageUrl*/ 8) textinput3_changes.value = /*imageUrl*/ ctx[3];
    			textinput3.$set(textinput3_changes);
    			const textinput4_changes = {};
    			if (dirty & /*address*/ 128) textinput4_changes.value = /*address*/ ctx[7];
    			textinput4.$set(textinput4_changes);
    			const textinput5_changes = {};
    			if (dirty & /*contact*/ 256) textinput5_changes.value = /*contact*/ ctx[8];
    			textinput5.$set(textinput5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput0.$$.fragment, local);
    			transition_in(textinput1.$$.fragment, local);
    			transition_in(textinput2.$$.fragment, local);
    			transition_in(textinput3.$$.fragment, local);
    			transition_in(textinput4.$$.fragment, local);
    			transition_in(textinput5.$$.fragment, local);

    			if (!form_intro) {
    				add_render_callback(() => {
    					form_intro = create_in_transition(form, fade, {});
    					form_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput0.$$.fragment, local);
    			transition_out(textinput1.$$.fragment, local);
    			transition_out(textinput2.$$.fragment, local);
    			transition_out(textinput3.$$.fragment, local);
    			transition_out(textinput4.$$.fragment, local);
    			transition_out(textinput5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(textinput0);
    			destroy_component(textinput1);
    			destroy_component(textinput2);
    			destroy_component(textinput3);
    			destroy_component(textinput4);
    			destroy_component(textinput5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(52:4) <Modal title=\\\"Re-home Form\\\" on:cancel>",
    		ctx
    	});

    	return block;
    }

    // (109:8) <CustomButton btntype="submit" disabled={!overallValid} on:click="{submitForm}" on:click={console.log(overallValid)}>
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Post Advert");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(109:8) <CustomButton btntype=\\\"submit\\\" disabled={!overallValid} on:click=\\\"{submitForm}\\\" on:click={console.log(overallValid)}>",
    		ctx
    	});

    	return block;
    }

    // (110:8) <CustomButton btntype="button" on:click="{cancel}">
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(110:8) <CustomButton btntype=\\\"button\\\" on:click=\\\"{cancel}\\\">",
    		ctx
    	});

    	return block;
    }

    // (108:4) 
    function create_footer_slot$3(ctx) {
    	let div;
    	let custombutton0;
    	let t;
    	let custombutton1;
    	let current;

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				disabled: !/*overallValid*/ ctx[9],
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*submitForm*/ ctx[10]);

    	custombutton0.$on("click", function () {
    		if (is_function(console.log(/*overallValid*/ ctx[9]))) console.log(/*overallValid*/ ctx[9]).apply(this, arguments);
    	});

    	custombutton1 = new CustomButton({
    			props: {
    				btntype: "button",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*cancel*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(custombutton0.$$.fragment);
    			t = space();
    			create_component(custombutton1.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$h, 107, 4, 2585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(custombutton0, div, null);
    			append_dev(div, t);
    			mount_component(custombutton1, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const custombutton0_changes = {};
    			if (dirty & /*overallValid*/ 512) custombutton0_changes.disabled = !/*overallValid*/ ctx[9];

    			if (dirty & /*$$scope*/ 1048576) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton0.$$.fragment, local);
    			transition_in(custombutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton0.$$.fragment, local);
    			transition_out(custombutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(custombutton0);
    			destroy_component(custombutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot$3.name,
    		type: "slot",
    		source: "(108:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Re-home Form",
    				$$slots: {
    					footer: [create_footer_slot$3],
    					default: [create_default_slot_2$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("cancel", /*cancel_handler*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, overallValid, contact, address, urlValid, imageUrl, descriptionValid, description, subtitle, title, titleValid*/ 1049599) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let descriptionValid;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditAdopt", slots, []);
    	let title = "";
    	let titleValid = false;
    	let subtitle = "";
    	let description = "";
    	let imageUrl = "";
    	let urlValid = false;
    	let address = "";
    	let contact = "";
    	let overallValid = false;
    	const dispatch = createEventDispatcher();

    	function submitForm() {
    		dispatch("adoption-submit", {
    			title,
    			subtitle,
    			description,
    			imageUrl,
    			address,
    			contact
    		});
    	}

    	function cancel() {
    		dispatch("cancel");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<EditAdopt> was created with unknown prop '${key}'`);
    	});

    	const input_handler = event => $$invalidate(0, title = event.target.value);
    	const input_handler_1 = event => $$invalidate(6, subtitle = event.target.value);
    	const input_handler_2 = event => $$invalidate(2, description = event.target.value);
    	const input_handler_3 = event => $$invalidate(3, imageUrl = event.target.value);
    	const input_handler_4 = event => $$invalidate(7, address = event.target.value);
    	const input_handler_5 = event => $$invalidate(8, contact = event.target.value);

    	function cancel_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$capture_state = () => ({
    		title,
    		titleValid,
    		subtitle,
    		description,
    		imageUrl,
    		urlValid,
    		address,
    		contact,
    		overallValid,
    		fade,
    		createEventDispatcher,
    		TextInput,
    		CustomButton,
    		Modal,
    		isEmpty,
    		validateUrl,
    		dispatch,
    		submitForm,
    		cancel,
    		descriptionValid
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("titleValid" in $$props) $$invalidate(1, titleValid = $$props.titleValid);
    		if ("subtitle" in $$props) $$invalidate(6, subtitle = $$props.subtitle);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("imageUrl" in $$props) $$invalidate(3, imageUrl = $$props.imageUrl);
    		if ("urlValid" in $$props) $$invalidate(4, urlValid = $$props.urlValid);
    		if ("address" in $$props) $$invalidate(7, address = $$props.address);
    		if ("contact" in $$props) $$invalidate(8, contact = $$props.contact);
    		if ("overallValid" in $$props) $$invalidate(9, overallValid = $$props.overallValid);
    		if ("descriptionValid" in $$props) $$invalidate(5, descriptionValid = $$props.descriptionValid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(1, titleValid = !isEmpty(title));
    		}

    		if ($$self.$$.dirty & /*description*/ 4) {
    			$$invalidate(5, descriptionValid = !isEmpty(description));
    		}

    		if ($$self.$$.dirty & /*imageUrl*/ 8) {
    			$$invalidate(4, urlValid = validateUrl(imageUrl));
    		}

    		if ($$self.$$.dirty & /*titleValid, descriptionValid, urlValid*/ 50) {
    			$$invalidate(9, overallValid = titleValid && descriptionValid && urlValid);
    		}
    	};

    	return [
    		title,
    		titleValid,
    		description,
    		imageUrl,
    		urlValid,
    		descriptionValid,
    		subtitle,
    		address,
    		contact,
    		overallValid,
    		submitForm,
    		cancel,
    		input_handler,
    		input_handler_1,
    		input_handler_2,
    		input_handler_3,
    		input_handler_4,
    		input_handler_5,
    		cancel_handler
    	];
    }

    class EditAdopt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditAdopt",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    //gitIgnore to hide credentials 
    let firebaseConfig = {
        apiKey: "AIzaSyBQVbwdP2FX4oybK9DeJahVSdB8pvXJ2GU",
        authDomain: "svelte-firebase-bknd.firebaseapp.com",
        databaseURL: "https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "svelte-firebase-bknd",
        storageBucket: "svelte-firebase-bknd.appspot.com",
        messagingSenderId: "1054394742369",
        appId: "1:1054394742369:web:bf162d06c4166290f89c20",
        measurementId: "G-8NFPZLWW48"
      };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Do a deep-copy of basic JavaScript Objects or Arrays.
     */
    function deepCopy(value) {
        return deepExtend(undefined, value);
    }
    /**
     * Copy properties from source to target (recursively allows extension
     * of Objects and Arrays).  Scalar values in the target are over-written.
     * If target is undefined, an object of the appropriate type will be created
     * (and returned).
     *
     * We recursively copy all child properties of plain Objects in the source- so
     * that namespace- like dictionaries are merged.
     *
     * Note that the target can be a function, in which case the properties in
     * the source Object are copied onto it as static properties of the Function.
     *
     * Note: we don't merge __proto__ to prevent prototype pollution
     */
    function deepExtend(target, source) {
        if (!(source instanceof Object)) {
            return source;
        }
        switch (source.constructor) {
            case Date:
                // Treat Dates like scalars; if the target date object had any child
                // properties - they will be lost!
                var dateValue = source;
                return new Date(dateValue.getTime());
            case Object:
                if (target === undefined) {
                    target = {};
                }
                break;
            case Array:
                // Always copy the array source and overwrite the target.
                target = [];
                break;
            default:
                // Not a plain Object - treat it as a scalar.
                return source;
        }
        for (var prop in source) {
            // use isValidKey to guard against prototype pollution. See https://snyk.io/vuln/SNYK-JS-LODASH-450202
            if (!source.hasOwnProperty(prop) || !isValidKey(prop)) {
                continue;
            }
            target[prop] = deepExtend(target[prop], source[prop]);
        }
        return target;
    }
    function isValidKey(key) {
        return key !== '__proto__';
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var Deferred = /** @class */ (function () {
        function Deferred() {
            var _this = this;
            this.reject = function () { };
            this.resolve = function () { };
            this.promise = new Promise(function (resolve, reject) {
                _this.resolve = resolve;
                _this.reject = reject;
            });
        }
        /**
         * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
         * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
         * and returns a node-style callback which will resolve or reject the Deferred's promise.
         */
        Deferred.prototype.wrapCallback = function (callback) {
            var _this = this;
            return function (error, value) {
                if (error) {
                    _this.reject(error);
                }
                else {
                    _this.resolve(value);
                }
                if (typeof callback === 'function') {
                    // Attaching noop handler just in case developer wasn't expecting
                    // promises
                    _this.promise.catch(function () { });
                    // Some of our callbacks don't expect a value and our own tests
                    // assert that the parameter length is 1
                    if (callback.length === 1) {
                        callback(error);
                    }
                    else {
                        callback(error, value);
                    }
                }
            };
        };
        return Deferred;
    }());
    /**
     * Detect Node.js.
     *
     * @return true if Node.js environment is detected.
     */
    // Node detection logic from: https://github.com/iliakan/detect-node/
    function isNode() {
        try {
            return (Object.prototype.toString.call(global.process) === '[object process]');
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Detect Browser Environment
     */
    function isBrowser() {
        return typeof self === 'object' && self.self === self;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var ERROR_NAME = 'FirebaseError';
    // Based on code from:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    var FirebaseError = /** @class */ (function (_super) {
        __extends(FirebaseError, _super);
        function FirebaseError(code, message, customData) {
            var _this = _super.call(this, message) || this;
            _this.code = code;
            _this.customData = customData;
            _this.name = ERROR_NAME;
            // Fix For ES5
            // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
            Object.setPrototypeOf(_this, FirebaseError.prototype);
            // Maintains proper stack trace for where our error was thrown.
            // Only available on V8.
            if (Error.captureStackTrace) {
                Error.captureStackTrace(_this, ErrorFactory.prototype.create);
            }
            return _this;
        }
        return FirebaseError;
    }(Error));
    var ErrorFactory = /** @class */ (function () {
        function ErrorFactory(service, serviceName, errors) {
            this.service = service;
            this.serviceName = serviceName;
            this.errors = errors;
        }
        ErrorFactory.prototype.create = function (code) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            var customData = data[0] || {};
            var fullCode = this.service + "/" + code;
            var template = this.errors[code];
            var message = template ? replaceTemplate(template, customData) : 'Error';
            // Service Name: Error message (service/code).
            var fullMessage = this.serviceName + ": " + message + " (" + fullCode + ").";
            var error = new FirebaseError(fullCode, fullMessage, customData);
            return error;
        };
        return ErrorFactory;
    }());
    function replaceTemplate(template, data) {
        return template.replace(PATTERN, function (_, key) {
            var value = data[key];
            return value != null ? String(value) : "<" + key + "?>";
        });
    }
    var PATTERN = /\{\$([^}]+)}/g;

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function contains(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    /**
     * Helper to make a Subscribe function (just like Promise helps make a
     * Thenable).
     *
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
    function createSubscribe(executor, onNoObservers) {
        var proxy = new ObserverProxy(executor, onNoObservers);
        return proxy.subscribe.bind(proxy);
    }
    /**
     * Implement fan-out for any number of Observers attached via a subscribe
     * function.
     */
    var ObserverProxy = /** @class */ (function () {
        /**
         * @param executor Function which can make calls to a single Observer
         *     as a proxy.
         * @param onNoObservers Callback when count of Observers goes to zero.
         */
        function ObserverProxy(executor, onNoObservers) {
            var _this = this;
            this.observers = [];
            this.unsubscribes = [];
            this.observerCount = 0;
            // Micro-task scheduling by calling task.then().
            this.task = Promise.resolve();
            this.finalized = false;
            this.onNoObservers = onNoObservers;
            // Call the executor asynchronously so subscribers that are called
            // synchronously after the creation of the subscribe function
            // can still receive the very first value generated in the executor.
            this.task
                .then(function () {
                executor(_this);
            })
                .catch(function (e) {
                _this.error(e);
            });
        }
        ObserverProxy.prototype.next = function (value) {
            this.forEachObserver(function (observer) {
                observer.next(value);
            });
        };
        ObserverProxy.prototype.error = function (error) {
            this.forEachObserver(function (observer) {
                observer.error(error);
            });
            this.close(error);
        };
        ObserverProxy.prototype.complete = function () {
            this.forEachObserver(function (observer) {
                observer.complete();
            });
            this.close();
        };
        /**
         * Subscribe function that can be used to add an Observer to the fan-out list.
         *
         * - We require that no event is sent to a subscriber sychronously to their
         *   call to subscribe().
         */
        ObserverProxy.prototype.subscribe = function (nextOrObserver, error, complete) {
            var _this = this;
            var observer;
            if (nextOrObserver === undefined &&
                error === undefined &&
                complete === undefined) {
                throw new Error('Missing Observer.');
            }
            // Assemble an Observer object when passed as callback functions.
            if (implementsAnyMethods(nextOrObserver, [
                'next',
                'error',
                'complete'
            ])) {
                observer = nextOrObserver;
            }
            else {
                observer = {
                    next: nextOrObserver,
                    error: error,
                    complete: complete
                };
            }
            if (observer.next === undefined) {
                observer.next = noop;
            }
            if (observer.error === undefined) {
                observer.error = noop;
            }
            if (observer.complete === undefined) {
                observer.complete = noop;
            }
            var unsub = this.unsubscribeOne.bind(this, this.observers.length);
            // Attempt to subscribe to a terminated Observable - we
            // just respond to the Observer with the final error or complete
            // event.
            if (this.finalized) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.task.then(function () {
                    try {
                        if (_this.finalError) {
                            observer.error(_this.finalError);
                        }
                        else {
                            observer.complete();
                        }
                    }
                    catch (e) {
                        // nothing
                    }
                    return;
                });
            }
            this.observers.push(observer);
            return unsub;
        };
        // Unsubscribe is synchronous - we guarantee that no events are sent to
        // any unsubscribed Observer.
        ObserverProxy.prototype.unsubscribeOne = function (i) {
            if (this.observers === undefined || this.observers[i] === undefined) {
                return;
            }
            delete this.observers[i];
            this.observerCount -= 1;
            if (this.observerCount === 0 && this.onNoObservers !== undefined) {
                this.onNoObservers(this);
            }
        };
        ObserverProxy.prototype.forEachObserver = function (fn) {
            if (this.finalized) {
                // Already closed by previous event....just eat the additional values.
                return;
            }
            // Since sendOne calls asynchronously - there is no chance that
            // this.observers will become undefined.
            for (var i = 0; i < this.observers.length; i++) {
                this.sendOne(i, fn);
            }
        };
        // Call the Observer via one of it's callback function. We are careful to
        // confirm that the observe has not been unsubscribed since this asynchronous
        // function had been queued.
        ObserverProxy.prototype.sendOne = function (i, fn) {
            var _this = this;
            // Execute the callback asynchronously
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.task.then(function () {
                if (_this.observers !== undefined && _this.observers[i] !== undefined) {
                    try {
                        fn(_this.observers[i]);
                    }
                    catch (e) {
                        // Ignore exceptions raised in Observers or missing methods of an
                        // Observer.
                        // Log error to console. b/31404806
                        if (typeof console !== 'undefined' && console.error) {
                            console.error(e);
                        }
                    }
                }
            });
        };
        ObserverProxy.prototype.close = function (err) {
            var _this = this;
            if (this.finalized) {
                return;
            }
            this.finalized = true;
            if (err !== undefined) {
                this.finalError = err;
            }
            // Proxy is no longer needed - garbage collect references
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.task.then(function () {
                _this.observers = undefined;
                _this.onNoObservers = undefined;
            });
        };
        return ObserverProxy;
    }());
    /**
     * Return true if the object passed in implements any of the named methods.
     */
    function implementsAnyMethods(obj, methods) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
            var method = methods_1[_i];
            if (method in obj && typeof obj[method] === 'function') {
                return true;
            }
        }
        return false;
    }
    function noop() {
        // do nothing
    }

    /**
     * Component for service name T, e.g. `auth`, `auth-internal`
     */
    var Component = /** @class */ (function () {
        /**
         *
         * @param name The public service name, e.g. app, auth, firestore, database
         * @param instanceFactory Service factory responsible for creating the public interface
         * @param type whether the service provided by the component is public or private
         */
        function Component(name, instanceFactory, type) {
            this.name = name;
            this.instanceFactory = instanceFactory;
            this.type = type;
            this.multipleInstances = false;
            /**
             * Properties to be added to the service namespace
             */
            this.serviceProps = {};
            this.instantiationMode = "LAZY" /* LAZY */;
        }
        Component.prototype.setInstantiationMode = function (mode) {
            this.instantiationMode = mode;
            return this;
        };
        Component.prototype.setMultipleInstances = function (multipleInstances) {
            this.multipleInstances = multipleInstances;
            return this;
        };
        Component.prototype.setServiceProps = function (props) {
            this.serviceProps = props;
            return this;
        };
        return Component;
    }());

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var DEFAULT_ENTRY_NAME$1 = '[DEFAULT]';

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
     * NameServiceMapping[T] is an alias for the type of the instance
     */
    var Provider = /** @class */ (function () {
        function Provider(name, container) {
            this.name = name;
            this.container = container;
            this.component = null;
            this.instances = new Map();
            this.instancesDeferred = new Map();
        }
        /**
         * @param identifier A provider can provide mulitple instances of a service
         * if this.component.multipleInstances is true.
         */
        Provider.prototype.get = function (identifier) {
            if (identifier === void 0) { identifier = DEFAULT_ENTRY_NAME$1; }
            // if multipleInstances is not supported, use the default name
            var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
            if (!this.instancesDeferred.has(normalizedIdentifier)) {
                var deferred = new Deferred();
                this.instancesDeferred.set(normalizedIdentifier, deferred);
                // If the service instance is available, resolve the promise with it immediately
                try {
                    var instance = this.getOrInitializeService(normalizedIdentifier);
                    if (instance) {
                        deferred.resolve(instance);
                    }
                }
                catch (e) {
                    // when the instance factory throws an exception during get(), it should not cause
                    // a fatal error. We just return the unresolved promise in this case.
                }
            }
            return this.instancesDeferred.get(normalizedIdentifier).promise;
        };
        Provider.prototype.getImmediate = function (options) {
            var _a = __assign({ identifier: DEFAULT_ENTRY_NAME$1, optional: false }, options), identifier = _a.identifier, optional = _a.optional;
            // if multipleInstances is not supported, use the default name
            var normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
            try {
                var instance = this.getOrInitializeService(normalizedIdentifier);
                if (!instance) {
                    if (optional) {
                        return null;
                    }
                    throw Error("Service " + this.name + " is not available");
                }
                return instance;
            }
            catch (e) {
                if (optional) {
                    return null;
                }
                else {
                    throw e;
                }
            }
        };
        Provider.prototype.getComponent = function () {
            return this.component;
        };
        Provider.prototype.setComponent = function (component) {
            var e_1, _a;
            if (component.name !== this.name) {
                throw Error("Mismatching Component " + component.name + " for Provider " + this.name + ".");
            }
            if (this.component) {
                throw Error("Component for " + this.name + " has already been provided");
            }
            this.component = component;
            // if the service is eager, initialize the default instance
            if (isComponentEager(component)) {
                try {
                    this.getOrInitializeService(DEFAULT_ENTRY_NAME$1);
                }
                catch (e) {
                    // when the instance factory for an eager Component throws an exception during the eager
                    // initialization, it should not cause a fatal error.
                    // TODO: Investigate if we need to make it configurable, because some component may want to cause
                    // a fatal error in this case?
                }
            }
            try {
                // Create service instances for the pending promises and resolve them
                // NOTE: if this.multipleInstances is false, only the default instance will be created
                // and all promises with resolve with it regardless of the identifier.
                for (var _b = __values(this.instancesDeferred.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), instanceIdentifier = _d[0], instanceDeferred = _d[1];
                    var normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                    try {
                        // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
                        var instance = this.getOrInitializeService(normalizedIdentifier);
                        instanceDeferred.resolve(instance);
                    }
                    catch (e) {
                        // when the instance factory throws an exception, it should not cause
                        // a fatal error. We just leave the promise unresolved.
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        Provider.prototype.clearInstance = function (identifier) {
            if (identifier === void 0) { identifier = DEFAULT_ENTRY_NAME$1; }
            this.instancesDeferred.delete(identifier);
            this.instances.delete(identifier);
        };
        // app.delete() will call this method on every provider to delete the services
        // TODO: should we mark the provider as deleted?
        Provider.prototype.delete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var services;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            services = Array.from(this.instances.values());
                            return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray([], __read(services
                                    .filter(function (service) { return 'INTERNAL' in service; }) // legacy services
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    .map(function (service) { return service.INTERNAL.delete(); }))), __read(services
                                    .filter(function (service) { return '_delete' in service; }) // modularized services
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    .map(function (service) { return service._delete(); }))))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Provider.prototype.isComponentSet = function () {
            return this.component != null;
        };
        Provider.prototype.isInitialized = function (identifier) {
            if (identifier === void 0) { identifier = DEFAULT_ENTRY_NAME$1; }
            return this.instances.has(identifier);
        };
        Provider.prototype.getOrInitializeService = function (identifier) {
            var instance = this.instances.get(identifier);
            if (!instance && this.component) {
                instance = this.component.instanceFactory(this.container, normalizeIdentifierForFactory(identifier));
                this.instances.set(identifier, instance);
            }
            return instance || null;
        };
        Provider.prototype.normalizeInstanceIdentifier = function (identifier) {
            if (this.component) {
                return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME$1;
            }
            else {
                return identifier; // assume multiple instances are supported before the component is provided.
            }
        };
        return Provider;
    }());
    // undefined should be passed to the service factory for the default instance
    function normalizeIdentifierForFactory(identifier) {
        return identifier === DEFAULT_ENTRY_NAME$1 ? undefined : identifier;
    }
    function isComponentEager(component) {
        return component.instantiationMode === "EAGER" /* EAGER */;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
     */
    var ComponentContainer = /** @class */ (function () {
        function ComponentContainer(name) {
            this.name = name;
            this.providers = new Map();
        }
        /**
         *
         * @param component Component being added
         * @param overwrite When a component with the same name has already been registered,
         * if overwrite is true: overwrite the existing component with the new component and create a new
         * provider with the new component. It can be useful in tests where you want to use different mocks
         * for different tests.
         * if overwrite is false: throw an exception
         */
        ComponentContainer.prototype.addComponent = function (component) {
            var provider = this.getProvider(component.name);
            if (provider.isComponentSet()) {
                throw new Error("Component " + component.name + " has already been registered with " + this.name);
            }
            provider.setComponent(component);
        };
        ComponentContainer.prototype.addOrOverwriteComponent = function (component) {
            var provider = this.getProvider(component.name);
            if (provider.isComponentSet()) {
                // delete the existing provider from the container, so we can register the new component
                this.providers.delete(component.name);
            }
            this.addComponent(component);
        };
        /**
         * getProvider provides a type safe interface where it can only be called with a field name
         * present in NameServiceMapping interface.
         *
         * Firebase SDKs providing services should extend NameServiceMapping interface to register
         * themselves.
         */
        ComponentContainer.prototype.getProvider = function (name) {
            if (this.providers.has(name)) {
                return this.providers.get(name);
            }
            // create a Provider for a service that hasn't registered with Firebase
            var provider = new Provider(name, this);
            this.providers.set(name, provider);
            return provider;
        };
        ComponentContainer.prototype.getProviders = function () {
            return Array.from(this.providers.values());
        };
        return ComponentContainer;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var _a$2;
    /**
     * A container for all of the Logger instances
     */
    var instances = [];
    /**
     * The JS SDK supports 5 log levels and also allows a user the ability to
     * silence the logs altogether.
     *
     * The order is a follows:
     * DEBUG < VERBOSE < INFO < WARN < ERROR
     *
     * All of the log types above the current log level will be captured (i.e. if
     * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
     * `VERBOSE` logs will not)
     */
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
        LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
        LogLevel[LogLevel["INFO"] = 2] = "INFO";
        LogLevel[LogLevel["WARN"] = 3] = "WARN";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
    })(LogLevel || (LogLevel = {}));
    var levelStringToEnum = {
        'debug': LogLevel.DEBUG,
        'verbose': LogLevel.VERBOSE,
        'info': LogLevel.INFO,
        'warn': LogLevel.WARN,
        'error': LogLevel.ERROR,
        'silent': LogLevel.SILENT
    };
    /**
     * The default log level
     */
    var defaultLogLevel = LogLevel.INFO;
    /**
     * By default, `console.debug` is not displayed in the developer console (in
     * chrome). To avoid forcing users to have to opt-in to these logs twice
     * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
     * logs to the `console.log` function.
     */
    var ConsoleMethod = (_a$2 = {},
        _a$2[LogLevel.DEBUG] = 'log',
        _a$2[LogLevel.VERBOSE] = 'log',
        _a$2[LogLevel.INFO] = 'info',
        _a$2[LogLevel.WARN] = 'warn',
        _a$2[LogLevel.ERROR] = 'error',
        _a$2);
    /**
     * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
     * messages on to their corresponding console counterparts (if the log method
     * is supported by the current log level)
     */
    var defaultLogHandler = function (instance, logType) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (logType < instance.logLevel) {
            return;
        }
        var now = new Date().toISOString();
        var method = ConsoleMethod[logType];
        if (method) {
            console[method].apply(console, __spreadArrays(["[" + now + "]  " + instance.name + ":"], args));
        }
        else {
            throw new Error("Attempted to log a message with an invalid logType (value: " + logType + ")");
        }
    };
    var Logger = /** @class */ (function () {
        /**
         * Gives you an instance of a Logger to capture messages according to
         * Firebase's logging scheme.
         *
         * @param name The name that the logs will be associated with
         */
        function Logger(name) {
            this.name = name;
            /**
             * The log level of the given Logger instance.
             */
            this._logLevel = defaultLogLevel;
            /**
             * The main (internal) log handler for the Logger instance.
             * Can be set to a new function in internal package code but not by user.
             */
            this._logHandler = defaultLogHandler;
            /**
             * The optional, additional, user-defined log handler for the Logger instance.
             */
            this._userLogHandler = null;
            /**
             * Capture the current instance for later use
             */
            instances.push(this);
        }
        Object.defineProperty(Logger.prototype, "logLevel", {
            get: function () {
                return this._logLevel;
            },
            set: function (val) {
                if (!(val in LogLevel)) {
                    throw new TypeError("Invalid value \"" + val + "\" assigned to `logLevel`");
                }
                this._logLevel = val;
            },
            enumerable: false,
            configurable: true
        });
        // Workaround for setter/getter having to be the same type.
        Logger.prototype.setLogLevel = function (val) {
            this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
        };
        Object.defineProperty(Logger.prototype, "logHandler", {
            get: function () {
                return this._logHandler;
            },
            set: function (val) {
                if (typeof val !== 'function') {
                    throw new TypeError('Value assigned to `logHandler` must be a function');
                }
                this._logHandler = val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Logger.prototype, "userLogHandler", {
            get: function () {
                return this._userLogHandler;
            },
            set: function (val) {
                this._userLogHandler = val;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * The functions below are all based on the `console` interface
         */
        Logger.prototype.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));
            this._logHandler.apply(this, __spreadArrays([this, LogLevel.DEBUG], args));
        };
        Logger.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));
            this._logHandler.apply(this, __spreadArrays([this, LogLevel.VERBOSE], args));
        };
        Logger.prototype.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));
            this._logHandler.apply(this, __spreadArrays([this, LogLevel.INFO], args));
        };
        Logger.prototype.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));
            this._logHandler.apply(this, __spreadArrays([this, LogLevel.WARN], args));
        };
        Logger.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._userLogHandler && this._userLogHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));
            this._logHandler.apply(this, __spreadArrays([this, LogLevel.ERROR], args));
        };
        return Logger;
    }());
    function setLogLevel(level) {
        instances.forEach(function (inst) {
            inst.setLogLevel(level);
        });
    }
    function setUserLogHandler(logCallback, options) {
        var _loop_1 = function (instance) {
            var customLogLevel = null;
            if (options && options.level) {
                customLogLevel = levelStringToEnum[options.level];
            }
            if (logCallback === null) {
                instance.userLogHandler = null;
            }
            else {
                instance.userLogHandler = function (instance, level) {
                    var args = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        args[_i - 2] = arguments[_i];
                    }
                    var message = args
                        .map(function (arg) {
                        if (arg == null) {
                            return null;
                        }
                        else if (typeof arg === 'string') {
                            return arg;
                        }
                        else if (typeof arg === 'number' || typeof arg === 'boolean') {
                            return arg.toString();
                        }
                        else if (arg instanceof Error) {
                            return arg.message;
                        }
                        else {
                            try {
                                return JSON.stringify(arg);
                            }
                            catch (ignored) {
                                return null;
                            }
                        }
                    })
                        .filter(function (arg) { return arg; })
                        .join(' ');
                    if (level >= (customLogLevel !== null && customLogLevel !== void 0 ? customLogLevel : instance.logLevel)) {
                        logCallback({
                            level: LogLevel[level].toLowerCase(),
                            message: message,
                            args: args,
                            type: instance.name
                        });
                    }
                };
            }
        };
        for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
            var instance = instances_1[_i];
            _loop_1(instance);
        }
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var _a;
    var ERRORS = (_a = {},
        _a["no-app" /* NO_APP */] = "No Firebase App '{$appName}' has been created - " +
            'call Firebase App.initializeApp()',
        _a["bad-app-name" /* BAD_APP_NAME */] = "Illegal App name: '{$appName}",
        _a["duplicate-app" /* DUPLICATE_APP */] = "Firebase App named '{$appName}' already exists",
        _a["app-deleted" /* APP_DELETED */] = "Firebase App named '{$appName}' already deleted",
        _a["invalid-app-argument" /* INVALID_APP_ARGUMENT */] = 'firebase.{$appName}() takes either no argument or a ' +
            'Firebase App instance.',
        _a["invalid-log-argument" /* INVALID_LOG_ARGUMENT */] = 'First argument to `onLog` must be null or a function.',
        _a);
    var ERROR_FACTORY = new ErrorFactory('app', 'Firebase', ERRORS);

    var name$1 = "@firebase/app";
    var version$1 = "0.6.16";

    var name$1$1 = "@firebase/analytics";

    var name$2 = "@firebase/auth";

    var name$3 = "@firebase/database";

    var name$4 = "@firebase/functions";

    var name$5 = "@firebase/installations";

    var name$6 = "@firebase/messaging";

    var name$7 = "@firebase/performance";

    var name$8 = "@firebase/remote-config";

    var name$9 = "@firebase/storage";

    var name$a = "@firebase/firestore";

    var name$b = "firebase-wrapper";

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var _a$1;
    var DEFAULT_ENTRY_NAME = '[DEFAULT]';
    var PLATFORM_LOG_STRING = (_a$1 = {},
        _a$1[name$1] = 'fire-core',
        _a$1[name$1$1] = 'fire-analytics',
        _a$1[name$2] = 'fire-auth',
        _a$1[name$3] = 'fire-rtdb',
        _a$1[name$4] = 'fire-fn',
        _a$1[name$5] = 'fire-iid',
        _a$1[name$6] = 'fire-fcm',
        _a$1[name$7] = 'fire-perf',
        _a$1[name$8] = 'fire-rc',
        _a$1[name$9] = 'fire-gcs',
        _a$1[name$a] = 'fire-fst',
        _a$1['fire-js'] = 'fire-js',
        _a$1[name$b] = 'fire-js-all',
        _a$1);

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var logger = new Logger('@firebase/app');

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Global context object for a collection of services using
     * a shared authentication state.
     */
    var FirebaseAppImpl = /** @class */ (function () {
        function FirebaseAppImpl(options, config, firebase_) {
            var _this = this;
            this.firebase_ = firebase_;
            this.isDeleted_ = false;
            this.name_ = config.name;
            this.automaticDataCollectionEnabled_ =
                config.automaticDataCollectionEnabled || false;
            this.options_ = deepCopy(options);
            this.container = new ComponentContainer(config.name);
            // add itself to container
            this._addComponent(new Component('app', function () { return _this; }, "PUBLIC" /* PUBLIC */));
            // populate ComponentContainer with existing components
            this.firebase_.INTERNAL.components.forEach(function (component) {
                return _this._addComponent(component);
            });
        }
        Object.defineProperty(FirebaseAppImpl.prototype, "automaticDataCollectionEnabled", {
            get: function () {
                this.checkDestroyed_();
                return this.automaticDataCollectionEnabled_;
            },
            set: function (val) {
                this.checkDestroyed_();
                this.automaticDataCollectionEnabled_ = val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FirebaseAppImpl.prototype, "name", {
            get: function () {
                this.checkDestroyed_();
                return this.name_;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FirebaseAppImpl.prototype, "options", {
            get: function () {
                this.checkDestroyed_();
                return this.options_;
            },
            enumerable: false,
            configurable: true
        });
        FirebaseAppImpl.prototype.delete = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.checkDestroyed_();
                resolve();
            })
                .then(function () {
                _this.firebase_.INTERNAL.removeApp(_this.name_);
                return Promise.all(_this.container.getProviders().map(function (provider) { return provider.delete(); }));
            })
                .then(function () {
                _this.isDeleted_ = true;
            });
        };
        /**
         * Return a service instance associated with this app (creating it
         * on demand), identified by the passed instanceIdentifier.
         *
         * NOTE: Currently storage and functions are the only ones that are leveraging this
         * functionality. They invoke it by calling:
         *
         * ```javascript
         * firebase.app().storage('STORAGE BUCKET ID')
         * ```
         *
         * The service name is passed to this already
         * @internal
         */
        FirebaseAppImpl.prototype._getService = function (name, instanceIdentifier) {
            if (instanceIdentifier === void 0) { instanceIdentifier = DEFAULT_ENTRY_NAME; }
            this.checkDestroyed_();
            // getImmediate will always succeed because _getService is only called for registered components.
            return this.container.getProvider(name).getImmediate({
                identifier: instanceIdentifier
            });
        };
        /**
         * Remove a service instance from the cache, so we will create a new instance for this service
         * when people try to get this service again.
         *
         * NOTE: currently only firestore is using this functionality to support firestore shutdown.
         *
         * @param name The service name
         * @param instanceIdentifier instance identifier in case multiple instances are allowed
         * @internal
         */
        FirebaseAppImpl.prototype._removeServiceInstance = function (name, instanceIdentifier) {
            if (instanceIdentifier === void 0) { instanceIdentifier = DEFAULT_ENTRY_NAME; }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.container.getProvider(name).clearInstance(instanceIdentifier);
        };
        /**
         * @param component the component being added to this app's container
         */
        FirebaseAppImpl.prototype._addComponent = function (component) {
            try {
                this.container.addComponent(component);
            }
            catch (e) {
                logger.debug("Component " + component.name + " failed to register with FirebaseApp " + this.name, e);
            }
        };
        FirebaseAppImpl.prototype._addOrOverwriteComponent = function (component) {
            this.container.addOrOverwriteComponent(component);
        };
        FirebaseAppImpl.prototype.toJSON = function () {
            return {
                name: this.name,
                automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
                options: this.options
            };
        };
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */
        FirebaseAppImpl.prototype.checkDestroyed_ = function () {
            if (this.isDeleted_) {
                throw ERROR_FACTORY.create("app-deleted" /* APP_DELETED */, { appName: this.name_ });
            }
        };
        return FirebaseAppImpl;
    }());
    // Prevent dead-code elimination of these methods w/o invalid property
    // copying.
    (FirebaseAppImpl.prototype.name && FirebaseAppImpl.prototype.options) ||
        FirebaseAppImpl.prototype.delete ||
        console.log('dc');

    var version$1$1 = "8.3.0";

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Because auth can't share code with other components, we attach the utility functions
     * in an internal namespace to share code.
     * This function return a firebase namespace object without
     * any utility functions, so it can be shared between the regular firebaseNamespace and
     * the lite version.
     */
    function createFirebaseNamespaceCore(firebaseAppImpl) {
        var apps = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var components = new Map();
        // A namespace is a plain JavaScript Object.
        var namespace = {
            // Hack to prevent Babel from modifying the object returned
            // as the firebase namespace.
            // @ts-ignore
            __esModule: true,
            initializeApp: initializeApp,
            // @ts-ignore
            app: app,
            registerVersion: registerVersion,
            setLogLevel: setLogLevel,
            onLog: onLog,
            // @ts-ignore
            apps: null,
            SDK_VERSION: version$1$1,
            INTERNAL: {
                registerComponent: registerComponent,
                removeApp: removeApp,
                components: components,
                useAsService: useAsService
            }
        };
        // Inject a circular default export to allow Babel users who were previously
        // using:
        //
        //   import firebase from 'firebase';
        //   which becomes: var firebase = require('firebase').default;
        //
        // instead of
        //
        //   import * as firebase from 'firebase';
        //   which becomes: var firebase = require('firebase');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        namespace['default'] = namespace;
        // firebase.apps is a read-only getter.
        Object.defineProperty(namespace, 'apps', {
            get: getApps
        });
        /**
         * Called by App.delete() - but before any services associated with the App
         * are deleted.
         */
        function removeApp(name) {
            delete apps[name];
        }
        /**
         * Get the App object for a given name (or DEFAULT).
         */
        function app(name) {
            name = name || DEFAULT_ENTRY_NAME;
            if (!contains(apps, name)) {
                throw ERROR_FACTORY.create("no-app" /* NO_APP */, { appName: name });
            }
            return apps[name];
        }
        // @ts-ignore
        app['App'] = firebaseAppImpl;
        function initializeApp(options, rawConfig) {
            if (rawConfig === void 0) { rawConfig = {}; }
            if (typeof rawConfig !== 'object' || rawConfig === null) {
                var name_1 = rawConfig;
                rawConfig = { name: name_1 };
            }
            var config = rawConfig;
            if (config.name === undefined) {
                config.name = DEFAULT_ENTRY_NAME;
            }
            var name = config.name;
            if (typeof name !== 'string' || !name) {
                throw ERROR_FACTORY.create("bad-app-name" /* BAD_APP_NAME */, {
                    appName: String(name)
                });
            }
            if (contains(apps, name)) {
                throw ERROR_FACTORY.create("duplicate-app" /* DUPLICATE_APP */, { appName: name });
            }
            var app = new firebaseAppImpl(options, config, namespace);
            apps[name] = app;
            return app;
        }
        /*
         * Return an array of all the non-deleted FirebaseApps.
         */
        function getApps() {
            // Make a copy so caller cannot mutate the apps list.
            return Object.keys(apps).map(function (name) { return apps[name]; });
        }
        function registerComponent(component) {
            var componentName = component.name;
            if (components.has(componentName)) {
                logger.debug("There were multiple attempts to register component " + componentName + ".");
                return component.type === "PUBLIC" /* PUBLIC */
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        namespace[componentName]
                    : null;
            }
            components.set(componentName, component);
            // create service namespace for public components
            if (component.type === "PUBLIC" /* PUBLIC */) {
                // The Service namespace is an accessor function ...
                var serviceNamespace = function (appArg) {
                    if (appArg === void 0) { appArg = app(); }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (typeof appArg[componentName] !== 'function') {
                        // Invalid argument.
                        // This happens in the following case: firebase.storage('gs:/')
                        throw ERROR_FACTORY.create("invalid-app-argument" /* INVALID_APP_ARGUMENT */, {
                            appName: componentName
                        });
                    }
                    // Forward service instance lookup to the FirebaseApp.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return appArg[componentName]();
                };
                // ... and a container for service-level properties.
                if (component.serviceProps !== undefined) {
                    deepExtend(serviceNamespace, component.serviceProps);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                namespace[componentName] = serviceNamespace;
                // Patch the FirebaseAppImpl prototype
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                firebaseAppImpl.prototype[componentName] =
                    // TODO: The eslint disable can be removed and the 'ignoreRestArgs'
                    // option added to the no-explicit-any rule when ESlint releases it.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var serviceFxn = this._getService.bind(this, componentName);
                        return serviceFxn.apply(this, component.multipleInstances ? args : []);
                    };
            }
            // add the component to existing app instances
            for (var _i = 0, _a = Object.keys(apps); _i < _a.length; _i++) {
                var appName = _a[_i];
                apps[appName]._addComponent(component);
            }
            return component.type === "PUBLIC" /* PUBLIC */
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    namespace[componentName]
                : null;
        }
        function registerVersion(libraryKeyOrName, version, variant) {
            var _a;
            // TODO: We can use this check to whitelist strings when/if we set up
            // a good whitelist system.
            var library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
            if (variant) {
                library += "-" + variant;
            }
            var libraryMismatch = library.match(/\s|\//);
            var versionMismatch = version.match(/\s|\//);
            if (libraryMismatch || versionMismatch) {
                var warning = [
                    "Unable to register library \"" + library + "\" with version \"" + version + "\":"
                ];
                if (libraryMismatch) {
                    warning.push("library name \"" + library + "\" contains illegal characters (whitespace or \"/\")");
                }
                if (libraryMismatch && versionMismatch) {
                    warning.push('and');
                }
                if (versionMismatch) {
                    warning.push("version name \"" + version + "\" contains illegal characters (whitespace or \"/\")");
                }
                logger.warn(warning.join(' '));
                return;
            }
            registerComponent(new Component(library + "-version", function () { return ({ library: library, version: version }); }, "VERSION" /* VERSION */));
        }
        function onLog(logCallback, options) {
            if (logCallback !== null && typeof logCallback !== 'function') {
                throw ERROR_FACTORY.create("invalid-log-argument" /* INVALID_LOG_ARGUMENT */);
            }
            setUserLogHandler(logCallback, options);
        }
        // Map the requested service to a registered service name
        // (used to map auth to serverAuth service when needed).
        function useAsService(app, name) {
            if (name === 'serverAuth') {
                return null;
            }
            var useService = name;
            return useService;
        }
        return namespace;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Return a firebase namespace object.
     *
     * In production, this will be called exactly once and the result
     * assigned to the 'firebase' global.  It may be called multiple times
     * in unit tests.
     */
    function createFirebaseNamespace() {
        var namespace = createFirebaseNamespaceCore(FirebaseAppImpl);
        namespace.INTERNAL = __assign(__assign({}, namespace.INTERNAL), { createFirebaseNamespace: createFirebaseNamespace,
            extendNamespace: extendNamespace,
            createSubscribe: createSubscribe,
            ErrorFactory: ErrorFactory,
            deepExtend: deepExtend });
        /**
         * Patch the top-level firebase namespace with additional properties.
         *
         * firebase.INTERNAL.extendNamespace()
         */
        function extendNamespace(props) {
            deepExtend(namespace, props);
        }
        return namespace;
    }
    var firebase = createFirebaseNamespace();

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    var PlatformLoggerService = /** @class */ (function () {
        function PlatformLoggerService(container) {
            this.container = container;
        }
        // In initial implementation, this will be called by installations on
        // auth token refresh, and installations will send this string.
        PlatformLoggerService.prototype.getPlatformInfoString = function () {
            var providers = this.container.getProviders();
            // Loop through providers and get library/version pairs from any that are
            // version components.
            return providers
                .map(function (provider) {
                if (isVersionServiceProvider(provider)) {
                    var service = provider.getImmediate();
                    return service.library + "/" + service.version;
                }
                else {
                    return null;
                }
            })
                .filter(function (logString) { return logString; })
                .join(' ');
        };
        return PlatformLoggerService;
    }());
    /**
     *
     * @param provider check if this provider provides a VersionService
     *
     * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
     * provides VersionService. The provider is not necessarily a 'app-version'
     * provider.
     */
    function isVersionServiceProvider(provider) {
        var component = provider.getComponent();
        return (component === null || component === void 0 ? void 0 : component.type) === "VERSION" /* VERSION */;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function registerCoreComponents(firebase, variant) {
        firebase.INTERNAL.registerComponent(new Component('platform-logger', function (container) { return new PlatformLoggerService(container); }, "PRIVATE" /* PRIVATE */));
        // Register `app` package.
        firebase.registerVersion(name$1, version$1, variant);
        // Register platform SDK identifier (no version).
        firebase.registerVersion('fire-js', '');
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // Firebase Lite detection test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isBrowser() && self.firebase !== undefined) {
        logger.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
        // eslint-disable-next-line
        var sdkVersion = self.firebase.SDK_VERSION;
        if (sdkVersion && sdkVersion.indexOf('LITE') >= 0) {
            logger.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
        }
    }
    var initializeApp = firebase.initializeApp;
    // TODO: This disable can be removed and the 'ignoreRestArgs' option added to
    // the no-explicit-any rule when ESlint releases it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    firebase.initializeApp = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // Environment check before initializing app
        // Do the check in initializeApp, so people have a chance to disable it by setting logLevel
        // in @firebase/logger
        if (isNode()) {
            logger.warn("\n      Warning: This is a browser-targeted Firebase bundle but it appears it is being\n      run in a Node environment.  If running in a Node environment, make sure you\n      are using the bundle specified by the \"main\" field in package.json.\n      \n      If you are using Webpack, you can specify \"main\" as the first item in\n      \"resolve.mainFields\":\n      https://webpack.js.org/configuration/resolve/#resolvemainfields\n      \n      If using Rollup, use the @rollup/plugin-node-resolve plugin and specify \"main\"\n      as the first item in \"mainFields\", e.g. ['main', 'module'].\n      https://github.com/rollup/@rollup/plugin-node-resolve\n      ");
        }
        return initializeApp.apply(undefined, args);
    };
    var firebase$1 = firebase;
    registerCoreComponents(firebase$1);

    var name = "firebase";
    var version = "8.3.0";

    /**
     * @license
     * Copyright 2018 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    firebase$1.registerVersion(name, version, 'app');

    (function() {/*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    var k,aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value);};function ba(a){a=["object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global,a];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}return globalThis}var ca=ba(this);
    function da(a,b){if(b){var c=ca;a=a.split(".");for(var d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e];}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&aa(c,a,{configurable:!0,writable:!0,value:b});}}function ea(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}function fa(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:ea(a)}}
    da("Promise",function(a){function b(g){this.b=0;this.c=void 0;this.a=[];var h=this.f();try{g(h.resolve,h.reject);}catch(m){h.reject(m);}}function c(){this.a=null;}function d(g){return g instanceof b?g:new b(function(h){h(g);})}if(a)return a;c.prototype.b=function(g){if(null==this.a){this.a=[];var h=this;this.c(function(){h.g();});}this.a.push(g);};var e=ca.setTimeout;c.prototype.c=function(g){e(g,0);};c.prototype.g=function(){for(;this.a&&this.a.length;){var g=this.a;this.a=[];for(var h=0;h<g.length;++h){var m=
    g[h];g[h]=null;try{m();}catch(p){this.f(p);}}}this.a=null;};c.prototype.f=function(g){this.c(function(){throw g;});};b.prototype.f=function(){function g(p){return function(v){m||(m=!0,p.call(h,v));}}var h=this,m=!1;return {resolve:g(this.m),reject:g(this.g)}};b.prototype.m=function(g){if(g===this)this.g(new TypeError("A Promise cannot resolve to itself"));else if(g instanceof b)this.s(g);else {a:switch(typeof g){case "object":var h=null!=g;break a;case "function":h=!0;break a;default:h=!1;}h?this.v(g):this.h(g);}};
    b.prototype.v=function(g){var h=void 0;try{h=g.then;}catch(m){this.g(m);return}"function"==typeof h?this.u(h,g):this.h(g);};b.prototype.g=function(g){this.i(2,g);};b.prototype.h=function(g){this.i(1,g);};b.prototype.i=function(g,h){if(0!=this.b)throw Error("Cannot settle("+g+", "+h+"): Promise already settled in state"+this.b);this.b=g;this.c=h;this.l();};b.prototype.l=function(){if(null!=this.a){for(var g=0;g<this.a.length;++g)f.b(this.a[g]);this.a=null;}};var f=new c;b.prototype.s=function(g){var h=this.f();
    g.Qa(h.resolve,h.reject);};b.prototype.u=function(g,h){var m=this.f();try{g.call(h,m.resolve,m.reject);}catch(p){m.reject(p);}};b.prototype.then=function(g,h){function m(A,Q){return "function"==typeof A?function(ya){try{p(A(ya));}catch(Ad){v(Ad);}}:Q}var p,v,B=new b(function(A,Q){p=A;v=Q;});this.Qa(m(g,p),m(h,v));return B};b.prototype.catch=function(g){return this.then(void 0,g)};b.prototype.Qa=function(g,h){function m(){switch(p.b){case 1:g(p.c);break;case 2:h(p.c);break;default:throw Error("Unexpected state: "+
    p.b);}}var p=this;null==this.a?f.b(m):this.a.push(m);};b.resolve=d;b.reject=function(g){return new b(function(h,m){m(g);})};b.race=function(g){return new b(function(h,m){for(var p=fa(g),v=p.next();!v.done;v=p.next())d(v.value).Qa(h,m);})};b.all=function(g){var h=fa(g),m=h.next();return m.done?d([]):new b(function(p,v){function B(ya){return function(Ad){A[ya]=Ad;Q--;0==Q&&p(A);}}var A=[],Q=0;do A.push(void 0),Q++,d(m.value).Qa(B(A.length-1),v),m=h.next();while(!m.done)})};return b});
    var ha=ha||{},l=this||self,ia=/^[\w+/_-]+[=]{0,2}$/,ja=null;function ka(a){return (a=a.querySelector&&a.querySelector("script[nonce]"))&&(a=a.nonce||a.getAttribute("nonce"))&&ia.test(a)?a:""}function la(){}function ma(a){var b=typeof a;return "object"!=b?b:a?Array.isArray(a)?"array":b:"null"}function na(a){var b=ma(a);return "array"==b||"object"==b&&"number"==typeof a.length}function oa(a){return "function"==ma(a)}function n(a){var b=typeof a;return "object"==b&&null!=a||"function"==b}
    function pa(a){return Object.prototype.hasOwnProperty.call(a,qa)&&a[qa]||(a[qa]=++ra)}var qa="closure_uid_"+(1E9*Math.random()>>>0),ra=0;function sa(a,b,c){return a.call.apply(a.bind,arguments)}function ta(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var e=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(e,d);return a.apply(b,e)}}return function(){return a.apply(b,arguments)}}
    function q(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?q=sa:q=ta;return q.apply(null,arguments)}function ua(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();d.push.apply(d,arguments);return a.apply(this,d)}}var va=Date.now;function r(a,b){function c(){}c.prototype=b.prototype;a.ab=b.prototype;a.prototype=new c;a.prototype.constructor=a;}function wa(a){return a}function t(a,b,c){this.code=xa+a;this.message=b||za[a]||"";this.a=c||null;}r(t,Error);t.prototype.w=function(){var a={code:this.code,message:this.message};this.a&&(a.serverResponse=this.a);return a};t.prototype.toJSON=function(){return this.w()};function Aa(a){var b=a&&a.code;return b?new t(b.substring(xa.length),a.message,a.serverResponse):null}
    var xa="auth/",za={"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.",
    "captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.",
    "requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","expired-action-code":"The action code has expired. ","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.",
    "internal-error":"An internal error has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registed for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal error has occurred.",
    "invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.",
    "invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is malformed or has expired.",
    "invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.",
    "unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
    "invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.",
    "multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.",
    "missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal error has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.",
    "missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network error (such as timeout, interrupted connection or unreachable host) has occurred.",
    "no-auth-event":"An internal error has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
    "popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.",
    "rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.",
    "too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.",
    "unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.",
    "web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled."};/*

     Copyright 2017 Google LLC

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
    */
    var Ba={ld:{Ta:"https://staging-identitytoolkit.sandbox.googleapis.com/identitytoolkit/v3/relyingparty/",Za:"https://staging-securetoken.sandbox.googleapis.com/v1/token",Wa:"https://staging-identitytoolkit.sandbox.googleapis.com/v2/",id:"b"},sd:{Ta:"https://www.googleapis.com/identitytoolkit/v3/relyingparty/",Za:"https://securetoken.googleapis.com/v1/token",Wa:"https://identitytoolkit.googleapis.com/v2/",id:"p"},ud:{Ta:"https://staging-www.sandbox.googleapis.com/identitytoolkit/v3/relyingparty/",
    Za:"https://staging-securetoken.sandbox.googleapis.com/v1/token",Wa:"https://staging-identitytoolkit.sandbox.googleapis.com/v2/",id:"s"},vd:{Ta:"https://www-googleapis-test.sandbox.google.com/identitytoolkit/v3/relyingparty/",Za:"https://test-securetoken.sandbox.googleapis.com/v1/token",Wa:"https://test-identitytoolkit.sandbox.googleapis.com/v2/",id:"t"}};
    function Ca(a){for(var b in Ba)if(Ba[b].id===a)return a=Ba[b],{firebaseEndpoint:a.Ta,secureTokenEndpoint:a.Za,identityPlatformEndpoint:a.Wa};return null}var Da;Da=Ca("__EID__")?"__EID__":void 0;function Ea(a){if(!a)return !1;try{return !!a.$goog_Thenable}catch(b){return !1}}function u(a){if(Error.captureStackTrace)Error.captureStackTrace(this,u);else {var b=Error().stack;b&&(this.stack=b);}a&&(this.message=String(a));}r(u,Error);u.prototype.name="CustomError";function Fa(a,b){a=a.split("%s");for(var c="",d=a.length-1,e=0;e<d;e++)c+=a[e]+(e<b.length?b[e]:"%s");u.call(this,c+a[d]);}r(Fa,u);Fa.prototype.name="AssertionError";function Ga(a,b){throw new Fa("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));}function Ha(a,b){this.c=a;this.f=b;this.b=0;this.a=null;}Ha.prototype.get=function(){if(0<this.b){this.b--;var a=this.a;this.a=a.next;a.next=null;}else a=this.c();return a};function Ia(a,b){a.f(b);100>a.b&&(a.b++,b.next=a.a,a.a=b);}function Ja(){this.b=this.a=null;}var La=new Ha(function(){return new Ka},function(a){a.reset();});Ja.prototype.add=function(a,b){var c=La.get();c.set(a,b);this.b?this.b.next=c:this.a=c;this.b=c;};function Ma(){var a=Na,b=null;a.a&&(b=a.a,a.a=a.a.next,a.a||(a.b=null),b.next=null);return b}function Ka(){this.next=this.b=this.a=null;}Ka.prototype.set=function(a,b){this.a=a;this.b=b;this.next=null;};Ka.prototype.reset=function(){this.next=this.b=this.a=null;};var Oa=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return "string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return -1},w=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c);}:function(a,b,c){for(var d=a.length,e="string"===typeof a?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a);};
    function Pa(a,b){for(var c="string"===typeof a?a.split(""):a,d=a.length-1;0<=d;--d)d in c&&b.call(void 0,c[d],d,a);}
    var Qa=Array.prototype.filter?function(a,b){return Array.prototype.filter.call(a,b,void 0)}:function(a,b){for(var c=a.length,d=[],e=0,f="string"===typeof a?a.split(""):a,g=0;g<c;g++)if(g in f){var h=f[g];b.call(void 0,h,g,a)&&(d[e++]=h);}return d},Ra=Array.prototype.map?function(a,b){return Array.prototype.map.call(a,b,void 0)}:function(a,b){for(var c=a.length,d=Array(c),e="string"===typeof a?a.split(""):a,f=0;f<c;f++)f in e&&(d[f]=b.call(void 0,e[f],f,a));return d},Sa=Array.prototype.some?function(a,
    b){return Array.prototype.some.call(a,b,void 0)}:function(a,b){for(var c=a.length,d="string"===typeof a?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a))return !0;return !1};function Ta(a){a:{var b=Ua;for(var c=a.length,d="string"===typeof a?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1;}return 0>b?null:"string"===typeof a?a.charAt(b):a[b]}function Va(a,b){return 0<=Oa(a,b)}
    function Wa(a,b){b=Oa(a,b);var c;(c=0<=b)&&Array.prototype.splice.call(a,b,1);return c}function Xa(a,b){var c=0;Pa(a,function(d,e){b.call(void 0,d,e,a)&&1==Array.prototype.splice.call(a,e,1).length&&c++;});}function Ya(a){return Array.prototype.concat.apply([],arguments)}function Za(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return []}var $a=String.prototype.trim?function(a){return a.trim()}:function(a){return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]},ab=/&/g,bb=/</g,cb=/>/g,db=/"/g,eb=/'/g,fb=/\x00/g,gb=/[\x00&<>"']/;function x(a,b){return -1!=a.indexOf(b)}function hb(a,b){return a<b?-1:a>b?1:0}var ib;a:{var jb=l.navigator;if(jb){var kb=jb.userAgent;if(kb){ib=kb;break a}}ib="";}function y(a){return x(ib,a)}function lb(a,b){for(var c in a)b.call(void 0,a[c],c,a);}function mb(a){for(var b in a)return !1;return !0}function nb(a){var b={},c;for(c in a)b[c]=a[c];return b}var ob="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function z(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<ob.length;f++)c=ob[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c]);}}function pb(a,b){a:{try{var c=a&&a.ownerDocument,d=c&&(c.defaultView||c.parentWindow);d=d||l;if(d.Element&&d.Location){var e=d;break a}}catch(g){}e=null;}if(e&&"undefined"!=typeof e[b]&&(!a||!(a instanceof e[b])&&(a instanceof e.Location||a instanceof e.Element))){if(n(a))try{var f=a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a);}catch(g){f="<object could not be stringified>";}else f=void 0===a?"undefined":null===a?"null":typeof a;Ga("Argument is not a %s (or a non-Element, non-Location mock); got: %s",
    b,f);}}function qb(a,b){this.a=a===rb&&b||"";this.b=sb;}qb.prototype.sa=!0;qb.prototype.ra=function(){return this.a};qb.prototype.toString=function(){return "Const{"+this.a+"}"};function tb(a){if(a instanceof qb&&a.constructor===qb&&a.b===sb)return a.a;Ga("expected object of type Const, got '"+a+"'");return "type_error:Const"}var sb={},rb={};var ub;function vb(){if(void 0===ub){var a=null,b=l.trustedTypes;if(b&&b.createPolicy){try{a=b.createPolicy("goog#html",{createHTML:wa,createScript:wa,createScriptURL:wa});}catch(c){l.console&&l.console.error(c.message);}ub=a;}else ub=a;}return ub}function wb(a,b){this.a=b===xb?a:"";}wb.prototype.sa=!0;wb.prototype.ra=function(){return this.a.toString()};wb.prototype.toString=function(){return "TrustedResourceUrl{"+this.a+"}"};function yb(a){if(a instanceof wb&&a.constructor===wb)return a.a;Ga("expected object of type TrustedResourceUrl, got '"+a+"' of type "+ma(a));return "type_error:TrustedResourceUrl"}
    function zb(a,b){var c=tb(a);if(!Ab.test(c))throw Error("Invalid TrustedResourceUrl format: "+c);a=c.replace(Bb,function(d,e){if(!Object.prototype.hasOwnProperty.call(b,e))throw Error('Found marker, "'+e+'", in format string, "'+c+'", but no valid label mapping found in args: '+JSON.stringify(b));d=b[e];return d instanceof qb?tb(d):encodeURIComponent(String(d))});return Cb(a)}var Bb=/%{(\w+)}/g,Ab=/^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i,xb={};
    function Cb(a){var b=vb();a=b?b.createScriptURL(a):a;return new wb(a,xb)}function C(a,b){this.a=b===Db?a:"";}C.prototype.sa=!0;C.prototype.ra=function(){return this.a.toString()};C.prototype.toString=function(){return "SafeUrl{"+this.a+"}"};function Eb(a){if(a instanceof C&&a.constructor===C)return a.a;Ga("expected object of type SafeUrl, got '"+a+"' of type "+ma(a));return "type_error:SafeUrl"}
    var Fb=/^(?:audio\/(?:3gpp2|3gpp|aac|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)|font\/\w+|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon)|text\/csv|video\/(?:mpeg|mp4|ogg|webm|quicktime|x-matroska))(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i,Gb=/^data:(.*);base64,[a-z0-9+\/]+=*$/i,Hb=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
    function Ib(a){if(a instanceof C)return a;a="object"==typeof a&&a.sa?a.ra():String(a);if(Hb.test(a))a=new C(a,Db);else {a=String(a);a=a.replace(/(%0A|%0D)/g,"");var b=a.match(Gb);a=b&&Fb.test(b[1])?new C(a,Db):null;}return a}function Jb(a){if(a instanceof C)return a;a="object"==typeof a&&a.sa?a.ra():String(a);Hb.test(a)||(a="about:invalid#zClosurez");return new C(a,Db)}var Db={},Kb=new C("about:invalid#zClosurez",Db);function Lb(a,b,c){this.a=c===Mb?a:"";}Lb.prototype.sa=!0;Lb.prototype.ra=function(){return this.a.toString()};Lb.prototype.toString=function(){return "SafeHtml{"+this.a+"}"};function Nb(a){if(a instanceof Lb&&a.constructor===Lb)return a.a;Ga("expected object of type SafeHtml, got '"+a+"' of type "+ma(a));return "type_error:SafeHtml"}var Mb={};function Ob(a,b){pb(a,"HTMLScriptElement");a.src=yb(b);(b=a.ownerDocument&&a.ownerDocument.defaultView)&&b!=l?b=ka(b.document):(null===ja&&(ja=ka(l.document)),b=ja);b&&a.setAttribute("nonce",b);}function Pb(a,b,c,d){a=a instanceof C?a:Jb(a);b=b||l;c=c instanceof qb?tb(c):c||"";return b.open(Eb(a),c,d,void 0)}function Qb(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}function Rb(a){gb.test(a)&&(-1!=a.indexOf("&")&&(a=a.replace(ab,"&amp;")),-1!=a.indexOf("<")&&(a=a.replace(bb,"&lt;")),-1!=a.indexOf(">")&&(a=a.replace(cb,"&gt;")),-1!=a.indexOf('"')&&(a=a.replace(db,"&quot;")),-1!=a.indexOf("'")&&(a=a.replace(eb,"&#39;")),-1!=a.indexOf("\x00")&&(a=a.replace(fb,"&#0;")));return a}function Sb(a){Sb[" "](a);return a}Sb[" "]=la;function Tb(a,b){var c=Ub;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)}var Vb=y("Opera"),Wb=y("Trident")||y("MSIE"),Xb=y("Edge"),Yb=Xb||Wb,Zb=y("Gecko")&&!(x(ib.toLowerCase(),"webkit")&&!y("Edge"))&&!(y("Trident")||y("MSIE"))&&!y("Edge"),$b=x(ib.toLowerCase(),"webkit")&&!y("Edge");function ac(){var a=l.document;return a?a.documentMode:void 0}var bc;
    a:{var cc="",dc=function(){var a=ib;if(Zb)return /rv:([^\);]+)(\)|;)/.exec(a);if(Xb)return /Edge\/([\d\.]+)/.exec(a);if(Wb)return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if($b)return /WebKit\/(\S+)/.exec(a);if(Vb)return /(?:Version)[ \/]?(\S+)/.exec(a)}();dc&&(cc=dc?dc[1]:"");if(Wb){var ec=ac();if(null!=ec&&ec>parseFloat(cc)){bc=String(ec);break a}}bc=cc;}var Ub={};
    function fc(a){return Tb(a,function(){for(var b=0,c=$a(String(bc)).split("."),d=$a(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",h=d[f]||"";do{g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];h=/(\d*)(\D*)(.*)/.exec(h)||["","","",""];if(0==g[0].length&&0==h[0].length)break;b=hb(0==g[1].length?0:parseInt(g[1],10),0==h[1].length?0:parseInt(h[1],10))||hb(0==g[2].length,0==h[2].length)||hb(g[2],h[2]);g=g[3];h=h[3];}while(0==b)}return 0<=b})}var gc;
    if(l.document&&Wb){var hc=ac();gc=hc?hc:parseInt(bc,10)||void 0;}else gc=void 0;var ic=gc;try{(new self.OffscreenCanvas(0,0)).getContext("2d");}catch(a){}var jc=!Wb||9<=Number(ic);function kc(a){var b=document;return "string"===typeof a?b.getElementById(a):a}function lc(a,b){lb(b,function(c,d){c&&"object"==typeof c&&c.sa&&(c=c.ra());"style"==d?a.style.cssText=c:"class"==d?a.className=c:"for"==d?a.htmlFor=c:mc.hasOwnProperty(d)?a.setAttribute(mc[d],c):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,c):a[d]=c;});}
    var mc={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};
    function nc(a,b,c){var d=arguments,e=document,f=String(d[0]),g=d[1];if(!jc&&g&&(g.name||g.type)){f=["<",f];g.name&&f.push(' name="',Rb(g.name),'"');if(g.type){f.push(' type="',Rb(g.type),'"');var h={};z(h,g);delete h.type;g=h;}f.push(">");f=f.join("");}f=oc(e,f);g&&("string"===typeof g?f.className=g:Array.isArray(g)?f.className=g.join(" "):lc(f,g));2<d.length&&pc(e,f,d);return f}
    function pc(a,b,c){function d(h){h&&b.appendChild("string"===typeof h?a.createTextNode(h):h);}for(var e=2;e<c.length;e++){var f=c[e];if(!na(f)||n(f)&&0<f.nodeType)d(f);else {a:{if(f&&"number"==typeof f.length){if(n(f)){var g="function"==typeof f.item||"string"==typeof f.item;break a}if(oa(f)){g="function"==typeof f.item;break a}}g=!1;}w(g?Za(f):f,d);}}}function oc(a,b){b=String(b);"application/xhtml+xml"===a.contentType&&(b=b.toLowerCase());return a.createElement(b)}function qc(a){l.setTimeout(function(){throw a;},0);}var rc;
    function sc(){var a=l.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!y("Presto")&&(a=function(){var e=oc(document,"IFRAME");e.style.display="none";document.documentElement.appendChild(e);var f=e.contentWindow;e=f.document;e.open();e.close();var g="callImmediate"+Math.random(),h="file:"==f.location.protocol?"*":f.location.protocol+"//"+f.location.host;e=q(function(m){if(("*"==h||m.origin==h)&&m.data==g)this.port1.onmessage();},this);
    f.addEventListener("message",e,!1);this.port1={};this.port2={postMessage:function(){f.postMessage(g,h);}};});if("undefined"!==typeof a&&!y("Trident")&&!y("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var e=c.Gb;c.Gb=null;e();}};return function(e){d.next={Gb:e};d=d.next;b.port2.postMessage(0);}}return function(e){l.setTimeout(e,0);}}function tc(a,b){uc||vc();wc||(uc(),wc=!0);Na.add(a,b);}var uc;function vc(){if(l.Promise&&l.Promise.resolve){var a=l.Promise.resolve(void 0);uc=function(){a.then(xc);};}else uc=function(){var b=xc;!oa(l.setImmediate)||l.Window&&l.Window.prototype&&!y("Edge")&&l.Window.prototype.setImmediate==l.setImmediate?(rc||(rc=sc()),rc(b)):l.setImmediate(b);};}var wc=!1,Na=new Ja;function xc(){for(var a;a=Ma();){try{a.a.call(a.b);}catch(b){qc(b);}Ia(La,a);}wc=!1;}function D(a,b){this.a=yc;this.i=void 0;this.f=this.b=this.c=null;this.g=this.h=!1;if(a!=la)try{var c=this;a.call(b,function(d){zc(c,Ac,d);},function(d){if(!(d instanceof Bc))try{if(d instanceof Error)throw d;throw Error("Promise rejected.");}catch(e){}zc(c,Cc,d);});}catch(d){zc(this,Cc,d);}}var yc=0,Ac=2,Cc=3;function Dc(){this.next=this.f=this.b=this.g=this.a=null;this.c=!1;}Dc.prototype.reset=function(){this.f=this.b=this.g=this.a=null;this.c=!1;};var Ec=new Ha(function(){return new Dc},function(a){a.reset();});
    function Fc(a,b,c){var d=Ec.get();d.g=a;d.b=b;d.f=c;return d}function E(a){if(a instanceof D)return a;var b=new D(la);zc(b,Ac,a);return b}function F(a){return new D(function(b,c){c(a);})}function Gc(a,b,c){Hc(a,b,c,null)||tc(ua(b,a));}function Ic(a){return new D(function(b,c){var d=a.length,e=[];if(d)for(var f=function(p,v){d--;e[p]=v;0==d&&b(e);},g=function(p){c(p);},h=0,m;h<a.length;h++)m=a[h],Gc(m,ua(f,h),g);else b(e);})}
    function Jc(a){return new D(function(b){var c=a.length,d=[];if(c)for(var e=function(h,m,p){c--;d[h]=m?{Pb:!0,value:p}:{Pb:!1,reason:p};0==c&&b(d);},f=0,g;f<a.length;f++)g=a[f],Gc(g,ua(e,f,!0),ua(e,f,!1));else b(d);})}D.prototype.then=function(a,b,c){return Kc(this,oa(a)?a:null,oa(b)?b:null,c)};D.prototype.$goog_Thenable=!0;k=D.prototype;k.oa=function(a,b){a=Fc(a,a,b);a.c=!0;Lc(this,a);return this};k.o=function(a,b){return Kc(this,null,a,b)};
    k.cancel=function(a){if(this.a==yc){var b=new Bc(a);tc(function(){Mc(this,b);},this);}};function Mc(a,b){if(a.a==yc)if(a.c){var c=a.c;if(c.b){for(var d=0,e=null,f=null,g=c.b;g&&(g.c||(d++,g.a==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(c.a==yc&&1==d?Mc(c,b):(f?(d=f,d.next==c.f&&(c.f=d),d.next=d.next.next):Nc(c),Oc(c,e,Cc,b)));}a.c=null;}else zc(a,Cc,b);}function Lc(a,b){a.b||a.a!=Ac&&a.a!=Cc||Pc(a);a.f?a.f.next=b:a.b=b;a.f=b;}
    function Kc(a,b,c,d){var e=Fc(null,null,null);e.a=new D(function(f,g){e.g=b?function(h){try{var m=b.call(d,h);f(m);}catch(p){g(p);}}:f;e.b=c?function(h){try{var m=c.call(d,h);void 0===m&&h instanceof Bc?g(h):f(m);}catch(p){g(p);}}:g;});e.a.c=a;Lc(a,e);return e.a}k.$c=function(a){this.a=yc;zc(this,Ac,a);};k.ad=function(a){this.a=yc;zc(this,Cc,a);};
    function zc(a,b,c){a.a==yc&&(a===c&&(b=Cc,c=new TypeError("Promise cannot resolve to itself")),a.a=1,Hc(c,a.$c,a.ad,a)||(a.i=c,a.a=b,a.c=null,Pc(a),b!=Cc||c instanceof Bc||Qc(a,c)));}function Hc(a,b,c,d){if(a instanceof D)return Lc(a,Fc(b||la,c||null,d)),!0;if(Ea(a))return a.then(b,c,d),!0;if(n(a))try{var e=a.then;if(oa(e))return Rc(a,e,b,c,d),!0}catch(f){return c.call(d,f),!0}return !1}
    function Rc(a,b,c,d,e){function f(m){h||(h=!0,d.call(e,m));}function g(m){h||(h=!0,c.call(e,m));}var h=!1;try{b.call(a,g,f);}catch(m){f(m);}}function Pc(a){a.h||(a.h=!0,tc(a.gc,a));}function Nc(a){var b=null;a.b&&(b=a.b,a.b=b.next,b.next=null);a.b||(a.f=null);return b}k.gc=function(){for(var a;a=Nc(this);)Oc(this,a,this.a,this.i);this.h=!1;};
    function Oc(a,b,c,d){if(c==Cc&&b.b&&!b.c)for(;a&&a.g;a=a.c)a.g=!1;if(b.a)b.a.c=null,Sc(b,c,d);else try{b.c?b.g.call(b.f):Sc(b,c,d);}catch(e){Tc.call(null,e);}Ia(Ec,b);}function Sc(a,b,c){b==Ac?a.g.call(a.f,c):a.b&&a.b.call(a.f,c);}function Qc(a,b){a.g=!0;tc(function(){a.g&&Tc.call(null,b);});}var Tc=qc;function Bc(a){u.call(this,a);}r(Bc,u);Bc.prototype.name="cancel";function Uc(){this.xa=this.xa;this.pa=this.pa;}var Vc=0;Uc.prototype.xa=!1;function Xc(a){if(!a.xa&&(a.xa=!0,a.Da(),0!=Vc)){pa(a);}}Uc.prototype.Da=function(){if(this.pa)for(;this.pa.length;)this.pa.shift()();};var Yc=Object.freeze||function(a){return a};var Zc=!Wb||9<=Number(ic),$c=Wb&&!fc("9"),ad=function(){if(!l.addEventListener||!Object.defineProperty)return !1;var a=!1,b=Object.defineProperty({},"passive",{get:function(){a=!0;}});try{l.addEventListener("test",la,b),l.removeEventListener("test",la,b);}catch(c){}return a}();function G(a,b){this.type=a;this.b=this.target=b;this.defaultPrevented=!1;}G.prototype.preventDefault=function(){this.defaultPrevented=!0;};function bd(a,b){G.call(this,a?a.type:"");this.relatedTarget=this.b=this.target=null;this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.key="";this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.pointerId=0;this.pointerType="";this.a=null;if(a){var c=this.type=a.type,d=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.b=b;if(b=a.relatedTarget){if(Zb){a:{try{Sb(b.nodeName);var e=!0;break a}catch(f){}e=!1;}e||(b=null);}}else "mouseover"==
    c?b=a.fromElement:"mouseout"==c&&(b=a.toElement);this.relatedTarget=b;d?(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=void 0!==a.clientX?a.clientX:a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0);this.button=a.button;this.key=a.key||"";this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=
    a.metaKey;this.pointerId=a.pointerId||0;this.pointerType="string"===typeof a.pointerType?a.pointerType:cd[a.pointerType]||"";this.a=a;a.defaultPrevented&&this.preventDefault();}}r(bd,G);var cd=Yc({2:"touch",3:"pen",4:"mouse"});bd.prototype.preventDefault=function(){bd.ab.preventDefault.call(this);var a=this.a;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,$c)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1;}catch(b){}};bd.prototype.g=function(){return this.a};var dd="closure_listenable_"+(1E6*Math.random()|0),ed=0;function fd(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.Va=e;this.key=++ed;this.va=this.Pa=!1;}function gd(a){a.va=!0;a.listener=null;a.proxy=null;a.src=null;a.Va=null;}function hd(a){this.src=a;this.a={};this.b=0;}hd.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.a[f];a||(a=this.a[f]=[],this.b++);var g=id(a,b,d,e);-1<g?(b=a[g],c||(b.Pa=!1)):(b=new fd(b,this.src,f,!!d,e),b.Pa=c,a.push(b));return b};function jd(a,b){var c=b.type;c in a.a&&Wa(a.a[c],b)&&(gd(b),0==a.a[c].length&&(delete a.a[c],a.b--));}function id(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.va&&f.listener==b&&f.capture==!!c&&f.Va==d)return e}return -1}var kd="closure_lm_"+(1E6*Math.random()|0),ld={};function nd(a,b,c,d,e){if(d&&d.once)od(a,b,c,d,e);else if(Array.isArray(b))for(var f=0;f<b.length;f++)nd(a,b[f],c,d,e);else c=pd(c),a&&a[dd]?qd(a,b,c,n(d)?!!d.capture:!!d,e):rd(a,b,c,!1,d,e);}
    function rd(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=n(e)?!!e.capture:!!e,h=sd(a);h||(a[kd]=h=new hd(a));c=h.add(b,c,d,g,f);if(!c.proxy){d=td();c.proxy=d;d.src=a;d.listener=c;if(a.addEventListener)ad||(e=g),void 0===e&&(e=!1),a.addEventListener(b.toString(),d,e);else if(a.attachEvent)a.attachEvent(ud(b.toString()),d);else if(a.addListener&&a.removeListener)a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");}}
    function td(){var a=vd,b=Zc?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function od(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)od(a,b[f],c,d,e);else c=pd(c),a&&a[dd]?wd(a,b,c,n(d)?!!d.capture:!!d,e):rd(a,b,c,!0,d,e);}
    function xd(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)xd(a,b[f],c,d,e);else (d=n(d)?!!d.capture:!!d,c=pd(c),a&&a[dd])?(a=a.v,b=String(b).toString(),b in a.a&&(f=a.a[b],c=id(f,c,d,e),-1<c&&(gd(f[c]),Array.prototype.splice.call(f,c,1),0==f.length&&(delete a.a[b],a.b--)))):a&&(a=sd(a))&&(b=a.a[b.toString()],a=-1,b&&(a=id(b,c,d,e)),(c=-1<a?b[a]:null)&&yd(c));}
    function yd(a){if("number"!==typeof a&&a&&!a.va){var b=a.src;if(b&&b[dd])jd(b.v,a);else {var c=a.type,d=a.proxy;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent?b.detachEvent(ud(c),d):b.addListener&&b.removeListener&&b.removeListener(d);(c=sd(b))?(jd(c,a),0==c.b&&(c.src=null,b[kd]=null)):gd(a);}}}function ud(a){return a in ld?ld[a]:ld[a]="on"+a}
    function zd(a,b,c,d){var e=!0;if(a=sd(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.capture==c&&!f.va&&(f=Bd(f,d),e=e&&!1!==f);}return e}function Bd(a,b){var c=a.listener,d=a.Va||a.src;a.Pa&&yd(a);return c.call(d,b)}
    function vd(a,b){if(a.va)return !0;if(!Zc){if(!b)a:{b=["window","event"];for(var c=l,d=0;d<b.length;d++)if(c=c[b[d]],null==c){b=null;break a}b=c;}d=b;b=new bd(d,this);c=!0;if(!(0>d.keyCode||void 0!=d.returnValue)){a:{var e=!1;if(0==d.keyCode)try{d.keyCode=-1;break a}catch(g){e=!0;}if(e||void 0==d.returnValue)d.returnValue=!0;}d=[];for(e=b.b;e;e=e.parentNode)d.push(e);a=a.type;for(e=d.length-1;0<=e;e--){b.b=d[e];var f=zd(d[e],a,!0,b);c=c&&f;}for(e=0;e<d.length;e++)b.b=d[e],f=zd(d[e],a,!1,b),c=c&&f;}return c}return Bd(a,
    new bd(b,this))}function sd(a){a=a[kd];return a instanceof hd?a:null}var Cd="__closure_events_fn_"+(1E9*Math.random()>>>0);function pd(a){if(oa(a))return a;a[Cd]||(a[Cd]=function(b){return a.handleEvent(b)});return a[Cd]}function H(){Uc.call(this);this.v=new hd(this);this.ac=this;this.gb=null;}r(H,Uc);H.prototype[dd]=!0;H.prototype.addEventListener=function(a,b,c,d){nd(this,a,b,c,d);};H.prototype.removeEventListener=function(a,b,c,d){xd(this,a,b,c,d);};
    H.prototype.dispatchEvent=function(a){var b,c=this.gb;if(c)for(b=[];c;c=c.gb)b.push(c);c=this.ac;var d=a.type||a;if("string"===typeof a)a=new G(a,c);else if(a instanceof G)a.target=a.target||c;else {var e=a;a=new G(d,c);z(a,e);}e=!0;if(b)for(var f=b.length-1;0<=f;f--){var g=a.b=b[f];e=Dd(g,d,!0,a)&&e;}g=a.b=c;e=Dd(g,d,!0,a)&&e;e=Dd(g,d,!1,a)&&e;if(b)for(f=0;f<b.length;f++)g=a.b=b[f],e=Dd(g,d,!1,a)&&e;return e};
    H.prototype.Da=function(){H.ab.Da.call(this);if(this.v){var a=this.v,c;for(c in a.a){for(var d=a.a[c],e=0;e<d.length;e++)gd(d[e]);delete a.a[c];a.b--;}}this.gb=null;};function qd(a,b,c,d,e){a.v.add(String(b),c,!1,d,e);}function wd(a,b,c,d,e){a.v.add(String(b),c,!0,d,e);}
    function Dd(a,b,c,d){b=a.v.a[String(b)];if(!b)return !0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.va&&g.capture==c){var h=g.listener,m=g.Va||g.src;g.Pa&&jd(a.v,g);e=!1!==h.call(m,d)&&e;}}return e&&!d.defaultPrevented}function Ed(a,b,c){if(oa(a))c&&(a=q(a,c));else if(a&&"function"==typeof a.handleEvent)a=q(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(b)?-1:l.setTimeout(a,b||0)}function Fd(a){var b=null;return (new D(function(c,d){b=Ed(function(){c(void 0);},a);-1==b&&d(Error("Failed to schedule timer."));})).o(function(c){l.clearTimeout(b);throw c;})}function Gd(a){if(a.W&&"function"==typeof a.W)return a.W();if("string"===typeof a)return a.split("");if(na(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}b=[];c=0;for(d in a)b[c++]=a[d];return b}function Hd(a){if(a.Y&&"function"==typeof a.Y)return a.Y();if(!a.W||"function"!=typeof a.W){if(na(a)||"string"===typeof a){var b=[];a=a.length;for(var c=0;c<a;c++)b.push(c);return b}b=[];c=0;for(var d in a)b[c++]=d;return b}}
    function Id(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(na(a)||"string"===typeof a)w(a,b,void 0);else for(var c=Hd(a),d=Gd(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a);}function Jd(a,b){this.b={};this.a=[];this.c=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1]);}else if(a)if(a instanceof Jd)for(c=a.Y(),d=0;d<c.length;d++)this.set(c[d],a.get(c[d]));else for(d in a)this.set(d,a[d]);}k=Jd.prototype;k.W=function(){Kd(this);for(var a=[],b=0;b<this.a.length;b++)a.push(this.b[this.a[b]]);return a};k.Y=function(){Kd(this);return this.a.concat()};
    k.clear=function(){this.b={};this.c=this.a.length=0;};function Kd(a){if(a.c!=a.a.length){for(var b=0,c=0;b<a.a.length;){var d=a.a[b];Ld(a.b,d)&&(a.a[c++]=d);b++;}a.a.length=c;}if(a.c!=a.a.length){var e={};for(c=b=0;b<a.a.length;)d=a.a[b],Ld(e,d)||(a.a[c++]=d,e[d]=1),b++;a.a.length=c;}}k.get=function(a,b){return Ld(this.b,a)?this.b[a]:b};k.set=function(a,b){Ld(this.b,a)||(this.c++,this.a.push(a));this.b[a]=b;};
    k.forEach=function(a,b){for(var c=this.Y(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this);}};function Ld(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var Md=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function Nd(a,b){if(a){a=a.split("&");for(var c=0;c<a.length;c++){var d=a[c].indexOf("="),e=null;if(0<=d){var f=a[c].substring(0,d);e=a[c].substring(d+1);}else f=a[c];b(f,e?decodeURIComponent(e.replace(/\+/g," ")):"");}}}function Od(a,b){this.a=this.l=this.c="";this.g=null;this.h=this.f="";this.i=!1;var c;a instanceof Od?(this.i=void 0!==b?b:a.i,Pd(this,a.c),this.l=a.l,this.a=a.a,Qd(this,a.g),this.f=a.f,Rd(this,Sd(a.b)),this.h=a.h):a&&(c=String(a).match(Md))?(this.i=!!b,Pd(this,c[1]||"",!0),this.l=Td(c[2]||""),this.a=Td(c[3]||"",!0),Qd(this,c[4]),this.f=Td(c[5]||"",!0),Rd(this,c[6]||"",!0),this.h=Td(c[7]||"")):(this.i=!!b,this.b=new Ud(null,this.i));}
    Od.prototype.toString=function(){var a=[],b=this.c;b&&a.push(Vd(b,Wd,!0),":");var c=this.a;if(c||"file"==b)a.push("//"),(b=this.l)&&a.push(Vd(b,Wd,!0),"@"),a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.g,null!=c&&a.push(":",String(c));if(c=this.f)this.a&&"/"!=c.charAt(0)&&a.push("/"),a.push(Vd(c,"/"==c.charAt(0)?Xd:Yd,!0));(c=this.b.toString())&&a.push("?",c);(c=this.h)&&a.push("#",Vd(c,Zd));return a.join("")};
    Od.prototype.resolve=function(a){var b=new Od(this),c=!!a.c;c?Pd(b,a.c):c=!!a.l;c?b.l=a.l:c=!!a.a;c?b.a=a.a:c=null!=a.g;var d=a.f;if(c)Qd(b,a.g);else if(c=!!a.f){if("/"!=d.charAt(0))if(this.a&&!this.f)d="/"+d;else {var e=b.f.lastIndexOf("/");-1!=e&&(d=b.f.substr(0,e+1)+d);}e=d;if(".."==e||"."==e)d="";else if(x(e,"./")||x(e,"/.")){d=0==e.lastIndexOf("/",0);e=e.split("/");for(var f=[],g=0;g<e.length;){var h=e[g++];"."==h?d&&g==e.length&&f.push(""):".."==h?((1<f.length||1==f.length&&""!=f[0])&&f.pop(),
    d&&g==e.length&&f.push("")):(f.push(h),d=!0);}d=f.join("/");}else d=e;}c?b.f=d:c=""!==a.b.toString();c?Rd(b,Sd(a.b)):c=!!a.h;c&&(b.h=a.h);return b};function Pd(a,b,c){a.c=c?Td(b,!0):b;a.c&&(a.c=a.c.replace(/:$/,""));}function Qd(a,b){if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.g=b;}else a.g=null;}function Rd(a,b,c){b instanceof Ud?(a.b=b,$d(a.b,a.i)):(c||(b=Vd(b,ae)),a.b=new Ud(b,a.i));}function I(a,b,c){a.b.set(b,c);}function be(a,b){return a.b.get(b)}
    function J(a){return a instanceof Od?new Od(a):new Od(a,void 0)}function ce(a,b,c,d){var e=new Od(null,void 0);a&&Pd(e,a);b&&(e.a=b);c&&Qd(e,c);d&&(e.f=d);return e}function Td(a,b){return a?b?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Vd(a,b,c){return "string"===typeof a?(a=encodeURI(a).replace(b,de),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function de(a){a=a.charCodeAt(0);return "%"+(a>>4&15).toString(16)+(a&15).toString(16)}
    var Wd=/[#\/\?@]/g,Yd=/[#\?:]/g,Xd=/[#\?]/g,ae=/[#\?@]/g,Zd=/#/g;function Ud(a,b){this.b=this.a=null;this.c=a||null;this.f=!!b;}function ee(a){a.a||(a.a=new Jd,a.b=0,a.c&&Nd(a.c,function(b,c){a.add(decodeURIComponent(b.replace(/\+/g," ")),c);}));}function fe(a){var b=Hd(a);if("undefined"==typeof b)throw Error("Keys are undefined");var c=new Ud(null,void 0);a=Gd(a);for(var d=0;d<b.length;d++){var e=b[d],f=a[d];Array.isArray(f)?ge(c,e,f):c.add(e,f);}return c}k=Ud.prototype;
    k.add=function(a,b){ee(this);this.c=null;a=he(this,a);var c=this.a.get(a);c||this.a.set(a,c=[]);c.push(b);this.b+=1;return this};function ie(a,b){ee(a);b=he(a,b);Ld(a.a.b,b)&&(a.c=null,a.b-=a.a.get(b).length,a=a.a,Ld(a.b,b)&&(delete a.b[b],a.c--,a.a.length>2*a.c&&Kd(a)));}k.clear=function(){this.a=this.c=null;this.b=0;};function je(a,b){ee(a);b=he(a,b);return Ld(a.a.b,b)}k.forEach=function(a,b){ee(this);this.a.forEach(function(c,d){w(c,function(e){a.call(b,e,d,this);},this);},this);};
    k.Y=function(){ee(this);for(var a=this.a.W(),b=this.a.Y(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};k.W=function(a){ee(this);var b=[];if("string"===typeof a)je(this,a)&&(b=Ya(b,this.a.get(he(this,a))));else {a=this.a.W();for(var c=0;c<a.length;c++)b=Ya(b,a[c]);}return b};k.set=function(a,b){ee(this);this.c=null;a=he(this,a);je(this,a)&&(this.b-=this.a.get(a).length);this.a.set(a,[b]);this.b+=1;return this};
    k.get=function(a,b){if(!a)return b;a=this.W(a);return 0<a.length?String(a[0]):b};function ge(a,b,c){ie(a,b);0<c.length&&(a.c=null,a.a.set(he(a,b),Za(c)),a.b+=c.length);}k.toString=function(){if(this.c)return this.c;if(!this.a)return "";for(var a=[],b=this.a.Y(),c=0;c<b.length;c++){var d=b[c],e=encodeURIComponent(String(d));d=this.W(d);for(var f=0;f<d.length;f++){var g=e;""!==d[f]&&(g+="="+encodeURIComponent(String(d[f])));a.push(g);}}return this.c=a.join("&")};
    function Sd(a){var b=new Ud;b.c=a.c;a.a&&(b.a=new Jd(a.a),b.b=a.b);return b}function he(a,b){b=String(b);a.f&&(b=b.toLowerCase());return b}function $d(a,b){b&&!a.f&&(ee(a),a.c=null,a.a.forEach(function(c,d){var e=d.toLowerCase();d!=e&&(ie(this,d),ge(this,e,c));},a));a.f=b;}function ke(a){var b=[];le(new me,a,b);return b.join("")}function me(){}
    function le(a,b,c){if(null==b)c.push("null");else {if("object"==typeof b){if(Array.isArray(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),le(a,d[f],c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else {c.push("{");e="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(f=b[d],"function"!=typeof f&&(c.push(e),ne(d,c),c.push(":"),le(a,f,c),e=","));c.push("}");return}}switch(typeof b){case "string":ne(b,c);break;case "number":c.push(isFinite(b)&&
    !isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}}var oe={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},pe=/\uffff/.test("\uffff")?/[\\"\x00-\x1f\x7f-\uffff]/g:/[\\"\x00-\x1f\x7f-\xff]/g;
    function ne(a,b){b.push('"',a.replace(pe,function(c){var d=oe[c];d||(d="\\u"+(c.charCodeAt(0)|65536).toString(16).substr(1),oe[c]=d);return d}),'"');}function qe(){var a=K();return Wb&&!!ic&&11==ic||/Edge\/\d+/.test(a)}function re(){return l.window&&l.window.location.href||self&&self.location&&self.location.href||""}function se(a,b){b=b||l.window;var c="about:blank";a&&(c=Eb(Ib(a)||Kb));b.location.href=c;}function te(a,b){var c=[],d;for(d in a)d in b?typeof a[d]!=typeof b[d]?c.push(d):"object"==typeof a[d]&&null!=a[d]&&null!=b[d]?0<te(a[d],b[d]).length&&c.push(d):a[d]!==b[d]&&c.push(d):c.push(d);for(d in b)d in a||c.push(d);return c}
    function ue(){var a=K();a=ve(a)!=we?null:(a=a.match(/\sChrome\/(\d+)/i))&&2==a.length?parseInt(a[1],10):null;return a&&30>a?!1:!Wb||!ic||9<ic}function xe(a){a=(a||K()).toLowerCase();return a.match(/android/)||a.match(/webos/)||a.match(/iphone|ipad|ipod/)||a.match(/blackberry/)||a.match(/windows phone/)||a.match(/iemobile/)?!0:!1}function ye(a){a=a||l.window;try{a.close();}catch(b){}}
    function ze(a,b,c){var d=Math.floor(1E9*Math.random()).toString();b=b||500;c=c||600;var e=(window.screen.availHeight-c)/2,f=(window.screen.availWidth-b)/2;b={width:b,height:c,top:0<e?e:0,left:0<f?f:0,location:!0,resizable:!0,statusbar:!0,toolbar:!1};c=K().toLowerCase();d&&(b.target=d,x(c,"crios/")&&(b.target="_blank"));ve(K())==Ae&&(a=a||"http://localhost",b.scrollbars=!0);c=a||"";(a=b)||(a={});d=window;b=c instanceof C?c:Ib("undefined"!=typeof c.href?c.href:String(c))||Kb;c=a.target||c.target;e=
    [];for(g in a)switch(g){case "width":case "height":case "top":case "left":e.push(g+"="+a[g]);break;case "target":case "noopener":case "noreferrer":break;default:e.push(g+"="+(a[g]?1:0));}var g=e.join(",");if((y("iPhone")&&!y("iPod")&&!y("iPad")||y("iPad")||y("iPod"))&&d.navigator&&d.navigator.standalone&&c&&"_self"!=c)g=oc(document,"A"),pb(g,"HTMLAnchorElement"),b=b instanceof C?b:Jb(b),g.href=Eb(b),g.setAttribute("target",c),a.noreferrer&&g.setAttribute("rel","noreferrer"),a=document.createEvent("MouseEvent"),
    a.initMouseEvent("click",!0,!0,d,1),g.dispatchEvent(a),g={};else if(a.noreferrer){if(g=Pb("",d,c,g),a=Eb(b),g&&(Yb&&x(a,";")&&(a="'"+a.replace(/'/g,"%27")+"'"),g.opener=null,a='<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0; url='+Rb(a)+'">',a=(d=vb())?d.createHTML(a):a,a=new Lb(a,null,Mb),d=g.document))d.write(Nb(a)),d.close();}else (g=Pb(b,d,c,g))&&a.noopener&&(g.opener=null);if(g)try{g.focus();}catch(h){}return g}
    function Be(a){return new D(function(b){function c(){Fd(2E3).then(function(){if(!a||a.closed)b();else return c()});}return c()})}var Ce=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,De=/^[^@]+@[^@]+$/;function Ee(){var a=null;return (new D(function(b){"complete"==l.document.readyState?b():(a=function(){b();},od(window,"load",a));})).o(function(b){xd(window,"load",a);throw b;})}
    function Fe(){return Ge(void 0)?Ee().then(function(){return new D(function(a,b){var c=l.document,d=setTimeout(function(){b(Error("Cordova framework is not ready."));},1E3);c.addEventListener("deviceready",function(){clearTimeout(d);a();},!1);})}):F(Error("Cordova must run in an Android or iOS file scheme."))}function Ge(a){a=a||K();return !("file:"!==He()&&"ionic:"!==He()||!a.toLowerCase().match(/iphone|ipad|ipod|android/))}function Ie(){var a=l.window;try{return !(!a||a==a.top)}catch(b){return !1}}
    function Je(){return "undefined"!==typeof l.WorkerGlobalScope&&"function"===typeof l.importScripts}function Ke(){return firebase$1.INTERNAL.hasOwnProperty("reactNative")?"ReactNative":firebase$1.INTERNAL.hasOwnProperty("node")?"Node":Je()?"Worker":"Browser"}function Le(){var a=Ke();return "ReactNative"===a||"Node"===a}function Me(){for(var a=50,b=[];0<a;)b.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62*Math.random()))),a--;return b.join("")}
    var Ae="Firefox",we="Chrome";
    function ve(a){var b=a.toLowerCase();if(x(b,"opera/")||x(b,"opr/")||x(b,"opios/"))return "Opera";if(x(b,"iemobile"))return "IEMobile";if(x(b,"msie")||x(b,"trident/"))return "IE";if(x(b,"edge/"))return "Edge";if(x(b,"firefox/"))return Ae;if(x(b,"silk/"))return "Silk";if(x(b,"blackberry"))return "Blackberry";if(x(b,"webos"))return "Webos";if(!x(b,"safari/")||x(b,"chrome/")||x(b,"crios/")||x(b,"android"))if(!x(b,"chrome/")&&!x(b,"crios/")||x(b,"edge/")){if(x(b,"android"))return "Android";if((a=a.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/))&&
    2==a.length)return a[1]}else return we;else return "Safari";return "Other"}var Ne={md:"FirebaseCore-web",od:"FirebaseUI-web"};function Oe(a,b){b=b||[];var c=[],d={},e;for(e in Ne)d[Ne[e]]=!0;for(e=0;e<b.length;e++)"undefined"!==typeof d[b[e]]&&(delete d[b[e]],c.push(b[e]));c.sort();b=c;b.length||(b=["FirebaseCore-web"]);c=Ke();"Browser"===c?(d=K(),c=ve(d)):"Worker"===c&&(d=K(),c=ve(d)+"-"+c);return c+"/JsCore/"+a+"/"+b.join(",")}function K(){return l.navigator&&l.navigator.userAgent||""}
    function L(a,b){a=a.split(".");b=b||l;for(var c=0;c<a.length&&"object"==typeof b&&null!=b;c++)b=b[a[c]];c!=a.length&&(b=void 0);return b}function Pe(){try{var a=l.localStorage,b=Qe();if(a)return a.setItem(b,"1"),a.removeItem(b),qe()?!!l.indexedDB:!0}catch(c){return Je()&&!!l.indexedDB}return !1}function Re(){return (Se()||"chrome-extension:"===He()||Ge())&&!Le()&&Pe()&&!Je()}function Se(){return "http:"===He()||"https:"===He()}function He(){return l.location&&l.location.protocol||null}
    function Te(a){a=a||K();return xe(a)||ve(a)==Ae?!1:!0}function Ue(a){return "undefined"===typeof a?null:ke(a)}function Ve(a){var b={},c;for(c in a)a.hasOwnProperty(c)&&null!==a[c]&&void 0!==a[c]&&(b[c]=a[c]);return b}function We(a){if(null!==a)return JSON.parse(a)}function Qe(a){return a?a:Math.floor(1E9*Math.random()).toString()}function Xe(a){a=a||K();return "Safari"==ve(a)||a.toLowerCase().match(/iphone|ipad|ipod/)?!1:!0}
    function Ye(){var a=l.___jsl;if(a&&a.H)for(var b in a.H)if(a.H[b].r=a.H[b].r||[],a.H[b].L=a.H[b].L||[],a.H[b].r=a.H[b].L.concat(),a.CP)for(var c=0;c<a.CP.length;c++)a.CP[c]=null;}function Ze(a,b){if(a>b)throw Error("Short delay should be less than long delay!");this.a=a;this.c=b;a=K();b=Ke();this.b=xe(a)||"ReactNative"===b;}
    Ze.prototype.get=function(){var a=l.navigator;return (a&&"boolean"===typeof a.onLine&&(Se()||"chrome-extension:"===He()||"undefined"!==typeof a.connection)?a.onLine:1)?this.b?this.c:this.a:Math.min(5E3,this.a)};function $e(){var a=l.document;return a&&"undefined"!==typeof a.visibilityState?"visible"==a.visibilityState:!0}
    function af(){var a=l.document,b=null;return $e()||!a?E():(new D(function(c){b=function(){$e()&&(a.removeEventListener("visibilitychange",b,!1),c());};a.addEventListener("visibilitychange",b,!1);})).o(function(c){a.removeEventListener("visibilitychange",b,!1);throw c;})}function bf(a){try{var b=new Date(parseInt(a,10));if(!isNaN(b.getTime())&&!/[^0-9]/.test(a))return b.toUTCString()}catch(c){}return null}function cf(){return !(!L("fireauth.oauthhelper",l)&&!L("fireauth.iframe",l))}
    function df(){var a=l.navigator;return a&&a.serviceWorker&&a.serviceWorker.controller||null}function ef(){var a=l.navigator;return a&&a.serviceWorker?E().then(function(){return a.serviceWorker.ready}).then(function(b){return b.active||null}).o(function(){return null}):E(null)}var ff={};function gf(a){ff[a]||(ff[a]=!0,"undefined"!==typeof console&&"function"===typeof console.warn&&console.warn(a));}var hf;try{var jf={};Object.defineProperty(jf,"abcd",{configurable:!0,enumerable:!0,value:1});Object.defineProperty(jf,"abcd",{configurable:!0,enumerable:!0,value:2});hf=2==jf.abcd;}catch(a){hf=!1;}function M(a,b,c){hf?Object.defineProperty(a,b,{configurable:!0,enumerable:!0,value:c}):a[b]=c;}function N(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&M(a,c,b[c]);}function kf(a){var b={};N(b,a);return b}function lf(a){var b={},c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}
    function mf(a,b){if(!b||!b.length)return !0;if(!a)return !1;for(var c=0;c<b.length;c++){var d=a[b[c]];if(void 0===d||null===d||""===d)return !1}return !0}function nf(a){var b=a;if("object"==typeof a&&null!=a){b="length"in a?[]:{};for(var c in a)M(b,c,nf(a[c]));}return b}function of(a){var b=a&&(a[pf]?"phone":null);if(b&&a&&a[qf]){M(this,"uid",a[qf]);M(this,"displayName",a[rf]||null);var c=null;a[sf]&&(c=(new Date(a[sf])).toUTCString());M(this,"enrollmentTime",c);M(this,"factorId",b);}else throw new t("internal-error","Internal assert: invalid MultiFactorInfo object");}of.prototype.w=function(){return {uid:this.uid,displayName:this.displayName,factorId:this.factorId,enrollmentTime:this.enrollmentTime}};function tf(a){try{var b=new uf(a);}catch(c){b=null;}return b}
    var rf="displayName",sf="enrolledAt",qf="mfaEnrollmentId",pf="phoneInfo";function uf(a){of.call(this,a);M(this,"phoneNumber",a[pf]);}r(uf,of);uf.prototype.w=function(){var a=uf.ab.w.call(this);a.phoneNumber=this.phoneNumber;return a};function vf(a){var b={},c=a[wf],d=a[xf],e=a[yf];a=tf(a[zf]);if(!e||e!=Af&&e!=Bf&&!c||e==Bf&&!d||e==Cf&&!a)throw Error("Invalid checkActionCode response!");e==Bf?(b[Df]=c||null,b[Ef]=c||null,b[Ff]=d):(b[Df]=d||null,b[Ef]=d||null,b[Ff]=c||null);b[Gf]=a||null;M(this,Hf,e);M(this,If,nf(b));}
    var Cf="REVERT_SECOND_FACTOR_ADDITION",Af="EMAIL_SIGNIN",Bf="VERIFY_AND_CHANGE_EMAIL",wf="email",zf="mfaInfo",xf="newEmail",yf="requestType",Ff="email",Df="fromEmail",Gf="multiFactorInfo",Ef="previousEmail",If="data",Hf="operation";function Jf(a){a=J(a);var b=be(a,Kf)||null,c=be(a,Lf)||null,d=be(a,Mf)||null;d=d?Nf[d]||null:null;if(!b||!c||!d)throw new t("argument-error",Kf+", "+Lf+"and "+Mf+" are required in a valid action code URL.");N(this,{apiKey:b,operation:d,code:c,continueUrl:be(a,Of)||null,languageCode:be(a,Pf)||null,tenantId:be(a,Qf)||null});}
    var Kf="apiKey",Lf="oobCode",Of="continueUrl",Pf="languageCode",Mf="mode",Qf="tenantId",Nf={recoverEmail:"RECOVER_EMAIL",resetPassword:"PASSWORD_RESET",revertSecondFactorAddition:Cf,signIn:Af,verifyAndChangeEmail:Bf,verifyEmail:"VERIFY_EMAIL"};function Rf(a){try{return new Jf(a)}catch(b){return null}}function Sf(a){var b=a[Tf];if("undefined"===typeof b)throw new t("missing-continue-uri");if("string"!==typeof b||"string"===typeof b&&!b.length)throw new t("invalid-continue-uri");this.h=b;this.b=this.a=null;this.g=!1;var c=a[Uf];if(c&&"object"===typeof c){b=c[Vf];var d=c[Wf];c=c[Xf];if("string"===typeof b&&b.length){this.a=b;if("undefined"!==typeof d&&"boolean"!==typeof d)throw new t("argument-error",Wf+" property must be a boolean when specified.");this.g=!!d;if("undefined"!==typeof c&&("string"!==
    typeof c||"string"===typeof c&&!c.length))throw new t("argument-error",Xf+" property must be a non empty string when specified.");this.b=c||null;}else {if("undefined"!==typeof b)throw new t("argument-error",Vf+" property must be a non empty string when specified.");if("undefined"!==typeof d||"undefined"!==typeof c)throw new t("missing-android-pkg-name");}}else if("undefined"!==typeof c)throw new t("argument-error",Uf+" property must be a non null object when specified.");this.f=null;if((b=a[Yf])&&"object"===
    typeof b)if(b=b[Zf],"string"===typeof b&&b.length)this.f=b;else {if("undefined"!==typeof b)throw new t("argument-error",Zf+" property must be a non empty string when specified.");}else if("undefined"!==typeof b)throw new t("argument-error",Yf+" property must be a non null object when specified.");b=a[$f];if("undefined"!==typeof b&&"boolean"!==typeof b)throw new t("argument-error",$f+" property must be a boolean when specified.");this.c=!!b;a=a[ag];if("undefined"!==typeof a&&("string"!==typeof a||"string"===
    typeof a&&!a.length))throw new t("argument-error",ag+" property must be a non empty string when specified.");this.i=a||null;}var Uf="android",ag="dynamicLinkDomain",$f="handleCodeInApp",Yf="iOS",Tf="url",Wf="installApp",Xf="minimumVersion",Vf="packageName",Zf="bundleId";
    function bg(a){var b={};b.continueUrl=a.h;b.canHandleCodeInApp=a.c;if(b.androidPackageName=a.a)b.androidMinimumVersion=a.b,b.androidInstallApp=a.g;b.iOSBundleId=a.f;b.dynamicLinkDomain=a.i;for(var c in b)null===b[c]&&delete b[c];return b}function cg(a){return Ra(a,function(b){b=b.toString(16);return 1<b.length?b:"0"+b}).join("")}var dg=null;function eg(a){var b=[];fg(a,function(c){b.push(c);});return b}function fg(a,b){function c(m){for(;d<a.length;){var p=a.charAt(d++),v=dg[p];if(null!=v)return v;if(!/^[\s\xa0]*$/.test(p))throw Error("Unknown base64 encoding at char: "+p);}return m}gg();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),h=c(64);if(64===h&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=h&&b(g<<6&192|h));}}
    function gg(){if(!dg){dg={};for(var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),b=["+/=","+/","-_=","-_.","-_"],c=0;5>c;c++)for(var d=a.concat(b[c].split("")),e=0;e<d.length;e++){var f=d[e];void 0===dg[f]&&(dg[f]=e);}}}function hg(a){var b=ig(a);if(!(b&&b.sub&&b.iss&&b.aud&&b.exp))throw Error("Invalid JWT");this.h=a;this.a=b.exp;this.i=b.sub;a=Date.now()/1E3;this.g=b.iat||(a>this.a?this.a:a);this.b=b.provider_id||b.firebase&&b.firebase.sign_in_provider||null;this.f=b.firebase&&b.firebase.tenant||null;this.c=!!b.is_anonymous||"anonymous"==this.b;}hg.prototype.T=function(){return this.f};hg.prototype.l=function(){return this.c};hg.prototype.toString=function(){return this.h};
    function jg(a){try{return new hg(a)}catch(b){return null}}
    function ig(a){if(!a)return null;a=a.split(".");if(3!=a.length)return null;a=a[1];for(var b=(4-a.length%4)%4,c=0;c<b;c++)a+=".";try{var d=eg(a);a=[];for(c=b=0;b<d.length;){var e=d[b++];if(128>e)a[c++]=String.fromCharCode(e);else if(191<e&&224>e){var f=d[b++];a[c++]=String.fromCharCode((e&31)<<6|f&63);}else if(239<e&&365>e){f=d[b++];var g=d[b++],h=d[b++],m=((e&7)<<18|(f&63)<<12|(g&63)<<6|h&63)-65536;a[c++]=String.fromCharCode(55296+(m>>10));a[c++]=String.fromCharCode(56320+(m&1023));}else f=d[b++],g=
    d[b++],a[c++]=String.fromCharCode((e&15)<<12|(f&63)<<6|g&63);}return JSON.parse(a.join(""))}catch(p){}return null}var kg="oauth_consumer_key oauth_nonce oauth_signature oauth_signature_method oauth_timestamp oauth_token oauth_version".split(" "),lg=["client_id","response_type","scope","redirect_uri","state"],mg={nd:{Ja:"locale",ua:700,ta:600,fa:"facebook.com",Xa:lg},pd:{Ja:null,ua:500,ta:750,fa:"github.com",Xa:lg},qd:{Ja:"hl",ua:515,ta:680,fa:"google.com",Xa:lg},wd:{Ja:"lang",ua:485,ta:705,fa:"twitter.com",Xa:kg},kd:{Ja:"locale",ua:640,ta:600,fa:"apple.com",Xa:[]}};
    function ng(a){for(var b in mg)if(mg[b].fa==a)return mg[b];return null}function og(a){var b={};b["facebook.com"]=pg;b["google.com"]=qg;b["github.com"]=rg;b["twitter.com"]=sg;var c=a&&a[tg];try{if(c)return b[c]?new b[c](a):new ug(a);if("undefined"!==typeof a[vg])return new wg(a)}catch(d){}return null}var vg="idToken",tg="providerId";
    function wg(a){var b=a[tg];if(!b&&a[vg]){var c=jg(a[vg]);c&&c.b&&(b=c.b);}if(!b)throw Error("Invalid additional user info!");if("anonymous"==b||"custom"==b)b=null;c=!1;"undefined"!==typeof a.isNewUser?c=!!a.isNewUser:"identitytoolkit#SignupNewUserResponse"===a.kind&&(c=!0);M(this,"providerId",b);M(this,"isNewUser",c);}function ug(a){wg.call(this,a);a=We(a.rawUserInfo||"{}");M(this,"profile",nf(a||{}));}r(ug,wg);
    function pg(a){ug.call(this,a);if("facebook.com"!=this.providerId)throw Error("Invalid provider ID!");}r(pg,ug);function rg(a){ug.call(this,a);if("github.com"!=this.providerId)throw Error("Invalid provider ID!");M(this,"username",this.profile&&this.profile.login||null);}r(rg,ug);function qg(a){ug.call(this,a);if("google.com"!=this.providerId)throw Error("Invalid provider ID!");}r(qg,ug);
    function sg(a){ug.call(this,a);if("twitter.com"!=this.providerId)throw Error("Invalid provider ID!");M(this,"username",a.screenName||null);}r(sg,ug);function xg(a){var b=J(a),c=be(b,"link"),d=be(J(c),"link");b=be(b,"deep_link_id");return be(J(b),"link")||b||d||c||a}function yg(a,b){if(!a&&!b)throw new t("internal-error","Internal assert: no raw session string available");if(a&&b)throw new t("internal-error","Internal assert: unable to determine the session type");this.a=a||null;this.b=b||null;this.type=this.a?zg:Ag;}var zg="enroll",Ag="signin";yg.prototype.Ha=function(){return this.a?E(this.a):E(this.b)};yg.prototype.w=function(){return this.type==zg?{multiFactorSession:{idToken:this.a}}:{multiFactorSession:{pendingCredential:this.b}}};function Bg(){}Bg.prototype.ka=function(){};Bg.prototype.b=function(){};Bg.prototype.c=function(){};Bg.prototype.w=function(){};function Cg(a,b){return a.then(function(c){if(c[Dg]){var d=jg(c[Dg]);if(!d||b!=d.i)throw new t("user-mismatch");return c}throw new t("user-mismatch");}).o(function(c){throw c&&c.code&&c.code==xa+"user-not-found"?new t("user-mismatch"):c;})}
    function Eg(a,b){if(b)this.a=b;else throw new t("internal-error","failed to construct a credential");M(this,"providerId",a);M(this,"signInMethod",a);}Eg.prototype.ka=function(a){return Fg(a,Gg(this))};Eg.prototype.b=function(a,b){var c=Gg(this);c.idToken=b;return Hg(a,c)};Eg.prototype.c=function(a,b){return Cg(Ig(a,Gg(this)),b)};function Gg(a){return {pendingToken:a.a,requestUri:"http://localhost"}}Eg.prototype.w=function(){return {providerId:this.providerId,signInMethod:this.signInMethod,pendingToken:this.a}};
    function Jg(a){if(a&&a.providerId&&a.signInMethod&&0==a.providerId.indexOf("saml.")&&a.pendingToken)try{return new Eg(a.providerId,a.pendingToken)}catch(b){}return null}
    function Kg(a,b,c){this.a=null;if(b.idToken||b.accessToken)b.idToken&&M(this,"idToken",b.idToken),b.accessToken&&M(this,"accessToken",b.accessToken),b.nonce&&!b.pendingToken&&M(this,"nonce",b.nonce),b.pendingToken&&(this.a=b.pendingToken);else if(b.oauthToken&&b.oauthTokenSecret)M(this,"accessToken",b.oauthToken),M(this,"secret",b.oauthTokenSecret);else throw new t("internal-error","failed to construct a credential");M(this,"providerId",a);M(this,"signInMethod",c);}
    Kg.prototype.ka=function(a){return Fg(a,Lg(this))};Kg.prototype.b=function(a,b){var c=Lg(this);c.idToken=b;return Hg(a,c)};Kg.prototype.c=function(a,b){var c=Lg(this);return Cg(Ig(a,c),b)};
    function Lg(a){var b={};a.idToken&&(b.id_token=a.idToken);a.accessToken&&(b.access_token=a.accessToken);a.secret&&(b.oauth_token_secret=a.secret);b.providerId=a.providerId;a.nonce&&!a.a&&(b.nonce=a.nonce);b={postBody:fe(b).toString(),requestUri:"http://localhost"};a.a&&(delete b.postBody,b.pendingToken=a.a);return b}
    Kg.prototype.w=function(){var a={providerId:this.providerId,signInMethod:this.signInMethod};this.idToken&&(a.oauthIdToken=this.idToken);this.accessToken&&(a.oauthAccessToken=this.accessToken);this.secret&&(a.oauthTokenSecret=this.secret);this.nonce&&(a.nonce=this.nonce);this.a&&(a.pendingToken=this.a);return a};
    function Mg(a){if(a&&a.providerId&&a.signInMethod){var b={idToken:a.oauthIdToken,accessToken:a.oauthTokenSecret?null:a.oauthAccessToken,oauthTokenSecret:a.oauthTokenSecret,oauthToken:a.oauthTokenSecret&&a.oauthAccessToken,nonce:a.nonce,pendingToken:a.pendingToken};try{return new Kg(a.providerId,b,a.signInMethod)}catch(c){}}return null}function Ng(a,b){this.Qc=b||[];N(this,{providerId:a,isOAuthProvider:!0});this.Ib={};this.pb=(ng(a)||{}).Ja||null;this.ob=null;}
    Ng.prototype.Ka=function(a){this.Ib=nb(a);return this};function Og(a){if("string"!==typeof a||0!=a.indexOf("saml."))throw new t("argument-error",'SAML provider IDs must be prefixed with "saml."');Ng.call(this,a,[]);}r(Og,Ng);function Pg(a){Ng.call(this,a,lg);this.a=[];}r(Pg,Ng);Pg.prototype.Ca=function(a){Va(this.a,a)||this.a.push(a);return this};Pg.prototype.Qb=function(){return Za(this.a)};
    Pg.prototype.credential=function(a,b){var c;n(a)?c={idToken:a.idToken||null,accessToken:a.accessToken||null,nonce:a.rawNonce||null}:c={idToken:a||null,accessToken:b||null};if(!c.idToken&&!c.accessToken)throw new t("argument-error","credential failed: must provide the ID token and/or the access token.");return new Kg(this.providerId,c,this.providerId)};function Qg(){Pg.call(this,"facebook.com");}r(Qg,Pg);M(Qg,"PROVIDER_ID","facebook.com");M(Qg,"FACEBOOK_SIGN_IN_METHOD","facebook.com");
    function Rg(a){if(!a)throw new t("argument-error","credential failed: expected 1 argument (the OAuth access token).");var b=a;n(a)&&(b=a.accessToken);return (new Qg).credential({accessToken:b})}function Sg(){Pg.call(this,"github.com");}r(Sg,Pg);M(Sg,"PROVIDER_ID","github.com");M(Sg,"GITHUB_SIGN_IN_METHOD","github.com");
    function Tg(a){if(!a)throw new t("argument-error","credential failed: expected 1 argument (the OAuth access token).");var b=a;n(a)&&(b=a.accessToken);return (new Sg).credential({accessToken:b})}function Ug(){Pg.call(this,"google.com");this.Ca("profile");}r(Ug,Pg);M(Ug,"PROVIDER_ID","google.com");M(Ug,"GOOGLE_SIGN_IN_METHOD","google.com");function Vg(a,b){var c=a;n(a)&&(c=a.idToken,b=a.accessToken);return (new Ug).credential({idToken:c,accessToken:b})}function Wg(){Ng.call(this,"twitter.com",kg);}
    r(Wg,Ng);M(Wg,"PROVIDER_ID","twitter.com");M(Wg,"TWITTER_SIGN_IN_METHOD","twitter.com");function Xg(a,b){var c=a;n(c)||(c={oauthToken:a,oauthTokenSecret:b});if(!c.oauthToken||!c.oauthTokenSecret)throw new t("argument-error","credential failed: expected 2 arguments (the OAuth access token and secret).");return new Kg("twitter.com",c,"twitter.com")}
    function Yg(a,b,c){this.a=a;this.f=b;M(this,"providerId","password");M(this,"signInMethod",c===Zg.EMAIL_LINK_SIGN_IN_METHOD?Zg.EMAIL_LINK_SIGN_IN_METHOD:Zg.EMAIL_PASSWORD_SIGN_IN_METHOD);}Yg.prototype.ka=function(a){return this.signInMethod==Zg.EMAIL_LINK_SIGN_IN_METHOD?O(a,$g,{email:this.a,oobCode:this.f}):O(a,ah,{email:this.a,password:this.f})};
    Yg.prototype.b=function(a,b){return this.signInMethod==Zg.EMAIL_LINK_SIGN_IN_METHOD?O(a,bh,{idToken:b,email:this.a,oobCode:this.f}):O(a,ch,{idToken:b,email:this.a,password:this.f})};Yg.prototype.c=function(a,b){return Cg(this.ka(a),b)};Yg.prototype.w=function(){return {email:this.a,password:this.f,signInMethod:this.signInMethod}};function dh(a){return a&&a.email&&a.password?new Yg(a.email,a.password,a.signInMethod):null}function Zg(){N(this,{providerId:"password",isOAuthProvider:!1});}
    function eh(a,b){b=fh(b);if(!b)throw new t("argument-error","Invalid email link!");return new Yg(a,b.code,Zg.EMAIL_LINK_SIGN_IN_METHOD)}function fh(a){a=xg(a);return (a=Rf(a))&&a.operation===Af?a:null}N(Zg,{PROVIDER_ID:"password"});N(Zg,{EMAIL_LINK_SIGN_IN_METHOD:"emailLink"});N(Zg,{EMAIL_PASSWORD_SIGN_IN_METHOD:"password"});function gh(a){if(!(a.eb&&a.cb||a.La&&a.ea))throw new t("internal-error");this.a=a;M(this,"providerId","phone");this.fa="phone";M(this,"signInMethod","phone");}
    gh.prototype.ka=function(a){return a.fb(hh(this))};gh.prototype.b=function(a,b){var c=hh(this);c.idToken=b;return O(a,ih,c)};gh.prototype.c=function(a,b){var c=hh(this);c.operation="REAUTH";a=O(a,jh,c);return Cg(a,b)};gh.prototype.w=function(){var a={providerId:"phone"};this.a.eb&&(a.verificationId=this.a.eb);this.a.cb&&(a.verificationCode=this.a.cb);this.a.La&&(a.temporaryProof=this.a.La);this.a.ea&&(a.phoneNumber=this.a.ea);return a};
    function kh(a){if(a&&"phone"===a.providerId&&(a.verificationId&&a.verificationCode||a.temporaryProof&&a.phoneNumber)){var b={};w(["verificationId","verificationCode","temporaryProof","phoneNumber"],function(c){a[c]&&(b[c]=a[c]);});return new gh(b)}return null}function hh(a){return a.a.La&&a.a.ea?{temporaryProof:a.a.La,phoneNumber:a.a.ea}:{sessionInfo:a.a.eb,code:a.a.cb}}
    function lh(a){try{this.a=a||firebase$1.auth();}catch(b){throw new t("argument-error","Either an instance of firebase.auth.Auth must be passed as an argument to the firebase.auth.PhoneAuthProvider constructor, or the default firebase App instance must be initialized via firebase.initializeApp().");}N(this,{providerId:"phone",isOAuthProvider:!1});}
    lh.prototype.fb=function(a,b){var c=this.a.a;return E(b.verify()).then(function(d){if("string"!==typeof d)throw new t("argument-error","An implementation of firebase.auth.ApplicationVerifier.prototype.verify() must return a firebase.Promise that resolves with a string.");switch(b.type){case "recaptcha":var e=n(a)?a.session:null,f=n(a)?a.phoneNumber:a,g;e&&e.type==zg?g=e.Ha().then(function(h){return mh(c,{idToken:h,phoneEnrollmentInfo:{phoneNumber:f,recaptchaToken:d}})}):e&&e.type==Ag?g=e.Ha().then(function(h){return nh(c,
    {mfaPendingCredential:h,mfaEnrollmentId:a.multiFactorHint&&a.multiFactorHint.uid||a.multiFactorUid,phoneSignInInfo:{recaptchaToken:d}})}):g=oh(c,{phoneNumber:f,recaptchaToken:d});return g.then(function(h){"function"===typeof b.reset&&b.reset();return h},function(h){"function"===typeof b.reset&&b.reset();throw h;});default:throw new t("argument-error",'Only firebase.auth.ApplicationVerifiers with type="recaptcha" are currently supported.');}})};
    function ph(a,b){if(!a)throw new t("missing-verification-id");if(!b)throw new t("missing-verification-code");return new gh({eb:a,cb:b})}N(lh,{PROVIDER_ID:"phone"});N(lh,{PHONE_SIGN_IN_METHOD:"phone"});
    function qh(a){if(a.temporaryProof&&a.phoneNumber)return new gh({La:a.temporaryProof,ea:a.phoneNumber});var b=a&&a.providerId;if(!b||"password"===b)return null;var c=a&&a.oauthAccessToken,d=a&&a.oauthTokenSecret,e=a&&a.nonce,f=a&&a.oauthIdToken,g=a&&a.pendingToken;try{switch(b){case "google.com":return Vg(f,c);case "facebook.com":return Rg(c);case "github.com":return Tg(c);case "twitter.com":return Xg(c,d);default:return c||d||f||g?g?0==b.indexOf("saml.")?new Eg(b,g):new Kg(b,{pendingToken:g,idToken:a.oauthIdToken,
    accessToken:a.oauthAccessToken},b):(new Pg(b)).credential({idToken:f,accessToken:c,rawNonce:e}):null}}catch(h){return null}}function rh(a){if(!a.isOAuthProvider)throw new t("invalid-oauth-provider");}function sh(a,b,c,d,e,f,g){this.c=a;this.b=b||null;this.g=c||null;this.f=d||null;this.i=f||null;this.h=g||null;this.a=e||null;if(this.g||this.a){if(this.g&&this.a)throw new t("invalid-auth-event");if(this.g&&!this.f)throw new t("invalid-auth-event");}else throw new t("invalid-auth-event");}sh.prototype.getUid=function(){var a=[];a.push(this.c);this.b&&a.push(this.b);this.f&&a.push(this.f);this.h&&a.push(this.h);return a.join("-")};sh.prototype.T=function(){return this.h};
    sh.prototype.w=function(){return {type:this.c,eventId:this.b,urlResponse:this.g,sessionId:this.f,postBody:this.i,tenantId:this.h,error:this.a&&this.a.w()}};function th(a){a=a||{};return a.type?new sh(a.type,a.eventId,a.urlResponse,a.sessionId,a.error&&Aa(a.error),a.postBody,a.tenantId):null}function uh(){this.b=null;this.a=[];}var vh=null;function wh(a){var b=vh;b.a.push(a);b.b||(b.b=function(c){for(var d=0;d<b.a.length;d++)b.a[d](c);},a=L("universalLinks.subscribe",l),"function"===typeof a&&a(null,b.b));}function xh(a){var b="unauthorized-domain",c=void 0,d=J(a);a=d.a;d=d.c;"chrome-extension"==d?c=Qb("This chrome extension ID (chrome-extension://%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.",a):"http"==d||"https"==d?c=Qb("This domain (%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.",a):b="operation-not-supported-in-this-environment";
    t.call(this,b,c);}r(xh,t);function yh(a,b,c){t.call(this,a,c);a=b||{};a.Jb&&M(this,"email",a.Jb);a.ea&&M(this,"phoneNumber",a.ea);a.credential&&M(this,"credential",a.credential);a.Zb&&M(this,"tenantId",a.Zb);}r(yh,t);yh.prototype.w=function(){var a={code:this.code,message:this.message};this.email&&(a.email=this.email);this.phoneNumber&&(a.phoneNumber=this.phoneNumber);this.tenantId&&(a.tenantId=this.tenantId);var b=this.credential&&this.credential.w();b&&z(a,b);return a};yh.prototype.toJSON=function(){return this.w()};
    function zh(a){if(a.code){var b=a.code||"";0==b.indexOf(xa)&&(b=b.substring(xa.length));var c={credential:qh(a),Zb:a.tenantId};if(a.email)c.Jb=a.email;else if(a.phoneNumber)c.ea=a.phoneNumber;else if(!c.credential)return new t(b,a.message||void 0);return new yh(b,c,a.message)}return null}function Ah(){}Ah.prototype.c=null;function Bh(a){return a.c||(a.c=a.b())}var Ch;function Dh(){}r(Dh,Ah);Dh.prototype.a=function(){var a=Eh(this);return a?new ActiveXObject(a):new XMLHttpRequest};Dh.prototype.b=function(){var a={};Eh(this)&&(a[0]=!0,a[1]=!0);return a};
    function Eh(a){if(!a.f&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.f=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.f}Ch=new Dh;function Fh(){}r(Fh,Ah);Fh.prototype.a=function(){var a=new XMLHttpRequest;if("withCredentials"in a)return a;if("undefined"!=typeof XDomainRequest)return new Gh;throw Error("Unsupported browser");};Fh.prototype.b=function(){return {}};
    function Gh(){this.a=new XDomainRequest;this.readyState=0;this.onreadystatechange=null;this.responseType=this.responseText=this.response="";this.status=-1;this.statusText="";this.a.onload=q(this.qc,this);this.a.onerror=q(this.Sb,this);this.a.onprogress=q(this.rc,this);this.a.ontimeout=q(this.vc,this);}k=Gh.prototype;k.open=function(a,b,c){if(null!=c&&!c)throw Error("Only async requests are supported.");this.a.open(a,b);};
    k.send=function(a){if(a)if("string"==typeof a)this.a.send(a);else throw Error("Only string data is supported");else this.a.send();};k.abort=function(){this.a.abort();};k.setRequestHeader=function(){};k.getResponseHeader=function(a){return "content-type"==a.toLowerCase()?this.a.contentType:""};k.qc=function(){this.status=200;this.response=this.responseText=this.a.responseText;Hh(this,4);};k.Sb=function(){this.status=500;this.response=this.responseText="";Hh(this,4);};k.vc=function(){this.Sb();};
    k.rc=function(){this.status=200;Hh(this,1);};function Hh(a,b){a.readyState=b;if(a.onreadystatechange)a.onreadystatechange();}k.getAllResponseHeaders=function(){return "content-type: "+this.a.contentType};function Ih(a,b,c){this.reset(a,b,c,void 0,void 0);}Ih.prototype.a=null;Ih.prototype.reset=function(a,b,c,d,e){delete this.a;};function Kh(a){this.f=a;this.b=this.c=this.a=null;}function Lh(a,b){this.name=a;this.value=b;}Lh.prototype.toString=function(){return this.name};var Mh=new Lh("SEVERE",1E3),Nh=new Lh("WARNING",900),Oh=new Lh("CONFIG",700),Ph=new Lh("FINE",500);function Qh(a){if(a.c)return a.c;if(a.a)return Qh(a.a);Ga("Root logger has no level set.");return null}Kh.prototype.log=function(a,b,c){if(a.value>=Qh(this).value)for(oa(b)&&(b=b()),a=new Ih(a,String(b),this.f),c&&(a.a=c),c=this;c;)c=c.a;};var Rh={},Sh=null;
    function Th(a){Sh||(Sh=new Kh(""),Rh[""]=Sh,Sh.c=Oh);var b;if(!(b=Rh[a])){b=new Kh(a);var c=a.lastIndexOf("."),d=a.substr(c+1);c=Th(a.substr(0,c));c.b||(c.b={});c.b[d]=b;b.a=c;Rh[a]=b;}return b}function Uh(a,b){a&&a.log(Ph,b,void 0);}function Vh(a){this.f=a;}r(Vh,Ah);Vh.prototype.a=function(){return new Wh(this.f)};Vh.prototype.b=function(a){return function(){return a}}({});function Wh(a){H.call(this);this.u=a;this.h=void 0;this.readyState=Xh;this.status=0;this.responseType=this.responseText=this.response=this.statusText="";this.onreadystatechange=null;this.l=new Headers;this.b=null;this.s="GET";this.f="";this.a=!1;this.i=Th("goog.net.FetchXmlHttp");this.m=this.c=this.g=null;}r(Wh,H);var Xh=0;k=Wh.prototype;
    k.open=function(a,b){if(this.readyState!=Xh)throw this.abort(),Error("Error reopening a connection");this.s=a;this.f=b;this.readyState=1;Yh(this);};k.send=function(a){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.a=!0;var b={headers:this.l,method:this.s,credentials:this.h,cache:void 0};a&&(b.body=a);this.u.fetch(new Request(this.f,b)).then(this.uc.bind(this),this.Ua.bind(this));};
    k.abort=function(){this.response=this.responseText="";this.l=new Headers;this.status=0;this.c&&this.c.cancel("Request was aborted.");1<=this.readyState&&this.a&&4!=this.readyState&&(this.a=!1,Zh(this));this.readyState=Xh;};
    k.uc=function(a){this.a&&(this.g=a,this.b||(this.status=this.g.status,this.statusText=this.g.statusText,this.b=a.headers,this.readyState=2,Yh(this)),this.a&&(this.readyState=3,Yh(this),this.a&&("arraybuffer"===this.responseType?a.arrayBuffer().then(this.sc.bind(this),this.Ua.bind(this)):"undefined"!==typeof l.ReadableStream&&"body"in a?(this.response=this.responseText="",this.c=a.body.getReader(),this.m=new TextDecoder,$h(this)):a.text().then(this.tc.bind(this),this.Ua.bind(this)))));};
    function $h(a){a.c.read().then(a.pc.bind(a)).catch(a.Ua.bind(a));}k.pc=function(a){if(this.a){var b=this.m.decode(a.value?a.value:new Uint8Array(0),{stream:!a.done});b&&(this.response=this.responseText+=b);a.done?Zh(this):Yh(this);3==this.readyState&&$h(this);}};k.tc=function(a){this.a&&(this.response=this.responseText=a,Zh(this));};k.sc=function(a){this.a&&(this.response=a,Zh(this));};k.Ua=function(a){var b=this.i;b&&b.log(Nh,"Failed to fetch url "+this.f,a instanceof Error?a:Error(a));this.a&&Zh(this);};
    function Zh(a){a.readyState=4;a.g=null;a.c=null;a.m=null;Yh(a);}k.setRequestHeader=function(a,b){this.l.append(a,b);};k.getResponseHeader=function(a){return this.b?this.b.get(a.toLowerCase())||"":((a=this.i)&&a.log(Nh,"Attempting to get response header but no headers have been received for url: "+this.f,void 0),"")};
    k.getAllResponseHeaders=function(){if(!this.b){var a=this.i;a&&a.log(Nh,"Attempting to get all response headers but no headers have been received for url: "+this.f,void 0);return ""}a=[];for(var b=this.b.entries(),c=b.next();!c.done;)c=c.value,a.push(c[0]+": "+c[1]),c=b.next();return a.join("\r\n")};function Yh(a){a.onreadystatechange&&a.onreadystatechange.call(a);}Object.defineProperty(Wh.prototype,"withCredentials",{get:function(){return "include"===this.h},set:function(a){this.h=a?"include":"same-origin";}});function ai(a){H.call(this);this.headers=new Jd;this.D=a||null;this.c=!1;this.C=this.a=null;this.h=this.R=this.l="";this.f=this.O=this.i=this.J=!1;this.g=0;this.s=null;this.m=bi;this.u=this.S=!1;}r(ai,H);var bi="";ai.prototype.b=Th("goog.net.XhrIo");var ci=/^https?$/i,di=["POST","PUT"];
    function ei(a,b,c,d,e){if(a.a)throw Error("[goog.net.XhrIo] Object is active with another request="+a.l+"; newUri="+b);c=c?c.toUpperCase():"GET";a.l=b;a.h="";a.R=c;a.J=!1;a.c=!0;a.a=a.D?a.D.a():Ch.a();a.C=a.D?Bh(a.D):Bh(Ch);a.a.onreadystatechange=q(a.Vb,a);try{Uh(a.b,fi(a,"Opening Xhr")),a.O=!0,a.a.open(c,String(b),!0),a.O=!1;}catch(g){Uh(a.b,fi(a,"Error opening Xhr: "+g.message));gi(a,g);return}b=d||"";var f=new Jd(a.headers);e&&Id(e,function(g,h){f.set(h,g);});e=Ta(f.Y());d=l.FormData&&b instanceof
    l.FormData;!Va(di,c)||e||d||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");f.forEach(function(g,h){this.a.setRequestHeader(h,g);},a);a.m&&(a.a.responseType=a.m);"withCredentials"in a.a&&a.a.withCredentials!==a.S&&(a.a.withCredentials=a.S);try{hi(a),0<a.g&&(a.u=ii(a.a),Uh(a.b,fi(a,"Will abort after "+a.g+"ms if incomplete, xhr2 "+a.u)),a.u?(a.a.timeout=a.g,a.a.ontimeout=q(a.Ma,a)):a.s=Ed(a.Ma,a.g,a)),Uh(a.b,fi(a,"Sending request")),a.i=!0,a.a.send(b),a.i=!1;}catch(g){Uh(a.b,
    fi(a,"Send error: "+g.message)),gi(a,g);}}function ii(a){return Wb&&fc(9)&&"number"===typeof a.timeout&&void 0!==a.ontimeout}function Ua(a){return "content-type"==a.toLowerCase()}k=ai.prototype;k.Ma=function(){"undefined"!=typeof ha&&this.a&&(this.h="Timed out after "+this.g+"ms, aborting",Uh(this.b,fi(this,this.h)),this.dispatchEvent("timeout"),this.abort(8));};function gi(a,b){a.c=!1;a.a&&(a.f=!0,a.a.abort(),a.f=!1);a.h=b;ji(a);ki(a);}
    function ji(a){a.J||(a.J=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"));}k.abort=function(){this.a&&this.c&&(Uh(this.b,fi(this,"Aborting")),this.c=!1,this.f=!0,this.a.abort(),this.f=!1,this.dispatchEvent("complete"),this.dispatchEvent("abort"),ki(this));};k.Da=function(){this.a&&(this.c&&(this.c=!1,this.f=!0,this.a.abort(),this.f=!1),ki(this,!0));ai.ab.Da.call(this);};k.Vb=function(){this.xa||(this.O||this.i||this.f?li(this):this.Jc());};k.Jc=function(){li(this);};
    function li(a){if(a.c&&"undefined"!=typeof ha)if(a.C[1]&&4==mi(a)&&2==ni(a))Uh(a.b,fi(a,"Local request error detected and ignored"));else if(a.i&&4==mi(a))Ed(a.Vb,0,a);else if(a.dispatchEvent("readystatechange"),4==mi(a)){Uh(a.b,fi(a,"Request complete"));a.c=!1;try{var b=ni(a);a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break a;default:c=!1;}var d;if(!(d=c)){var e;if(e=0===b){var f=String(a.l).match(Md)[1]||null;if(!f&&l.self&&l.self.location){var g=l.self.location.protocol;
    f=g.substr(0,g.length-1);}e=!ci.test(f?f.toLowerCase():"");}d=e;}if(d)a.dispatchEvent("complete"),a.dispatchEvent("success");else {try{var h=2<mi(a)?a.a.statusText:"";}catch(m){Uh(a.b,"Can not get status: "+m.message),h="";}a.h=h+" ["+ni(a)+"]";ji(a);}}finally{ki(a);}}}function ki(a,b){if(a.a){hi(a);var c=a.a,d=a.C[0]?la:null;a.a=null;a.C=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d;}catch(e){(a=a.b)&&a.log(Mh,"Problem encountered resetting onreadystatechange: "+e.message,void 0);}}}
    function hi(a){a.a&&a.u&&(a.a.ontimeout=null);a.s&&(l.clearTimeout(a.s),a.s=null);}function mi(a){return a.a?a.a.readyState:0}function ni(a){try{return 2<mi(a)?a.a.status:-1}catch(b){return -1}}function oi(a){try{return a.a?a.a.responseText:""}catch(b){return Uh(a.b,"Can not get responseText: "+b.message),""}}
    k.getResponse=function(){try{if(!this.a)return null;if("response"in this.a)return this.a.response;switch(this.m){case bi:case "text":return this.a.responseText;case "arraybuffer":if("mozResponseArrayBuffer"in this.a)return this.a.mozResponseArrayBuffer}var a=this.b;a&&a.log(Mh,"Response type "+this.m+" is not supported on this browser",void 0);return null}catch(b){return Uh(this.b,"Can not get response: "+b.message),null}};function fi(a,b){return b+" ["+a.R+" "+a.l+" "+ni(a)+"]"}function pi(a){var b=qi;this.g=[];this.u=b;this.s=a||null;this.f=this.a=!1;this.c=void 0;this.v=this.C=this.i=!1;this.h=0;this.b=null;this.l=0;}pi.prototype.cancel=function(a){if(this.a)this.c instanceof pi&&this.c.cancel();else {if(this.b){var b=this.b;delete this.b;a?b.cancel(a):(b.l--,0>=b.l&&b.cancel());}this.u?this.u.call(this.s,this):this.v=!0;this.a||(a=new ri(this),si(this),ti(this,!1,a));}};pi.prototype.m=function(a,b){this.i=!1;ti(this,a,b);};function ti(a,b,c){a.a=!0;a.c=c;a.f=!b;ui(a);}
    function si(a){if(a.a){if(!a.v)throw new vi(a);a.v=!1;}}function wi(a,b){xi(a,null,b,void 0);}function xi(a,b,c,d){a.g.push([b,c,d]);a.a&&ui(a);}pi.prototype.then=function(a,b,c){var d,e,f=new D(function(g,h){d=g;e=h;});xi(this,d,function(g){g instanceof ri?f.cancel():e(g);});return f.then(a,b,c)};pi.prototype.$goog_Thenable=!0;function yi(a){return Sa(a.g,function(b){return oa(b[1])})}
    function ui(a){if(a.h&&a.a&&yi(a)){var b=a.h,c=zi[b];c&&(l.clearTimeout(c.a),delete zi[b]);a.h=0;}a.b&&(a.b.l--,delete a.b);b=a.c;for(var d=c=!1;a.g.length&&!a.i;){var e=a.g.shift(),f=e[0],g=e[1];e=e[2];if(f=a.f?g:f)try{var h=f.call(e||a.s,b);void 0!==h&&(a.f=a.f&&(h==b||h instanceof Error),a.c=b=h);if(Ea(b)||"function"===typeof l.Promise&&b instanceof l.Promise)d=!0,a.i=!0;}catch(m){b=m,a.f=!0,yi(a)||(c=!0);}}a.c=b;d&&(h=q(a.m,a,!0),d=q(a.m,a,!1),b instanceof pi?(xi(b,h,d),b.C=!0):b.then(h,d));c&&(b=
    new Ai(b),zi[b.a]=b,a.h=b.a);}function vi(){u.call(this);}r(vi,u);vi.prototype.message="Deferred has already fired";vi.prototype.name="AlreadyCalledError";function ri(){u.call(this);}r(ri,u);ri.prototype.message="Deferred was canceled";ri.prototype.name="CanceledError";function Ai(a){this.a=l.setTimeout(q(this.c,this),0);this.b=a;}Ai.prototype.c=function(){delete zi[this.a];throw this.b;};var zi={};function Bi(a){var c=document,d=yb(a).toString(),e=oc(document,"SCRIPT"),f={Wb:e,Ma:void 0},g=new pi(f),h=null,m=5E3;(h=window.setTimeout(function(){Ci(e,!0);var p=new Di(Ei,"Timeout reached for loading script "+d);si(g);ti(g,!1,p);},m),f.Ma=h);e.onload=e.onreadystatechange=function(){e.readyState&&"loaded"!=e.readyState&&"complete"!=e.readyState||(Ci(e,!1,h),si(g),ti(g,!0,null));};e.onerror=function(){Ci(e,!0,h);var p=new Di(Fi,"Error while loading script "+
    d);si(g);ti(g,!1,p);};f={};z(f,{type:"text/javascript",charset:"UTF-8"});lc(e,f);Ob(e,a);Gi(c).appendChild(e);return g}function Gi(a){var b;return (b=(a||document).getElementsByTagName("HEAD"))&&0!=b.length?b[0]:a.documentElement}function qi(){if(this&&this.Wb){var a=this.Wb;a&&"SCRIPT"==a.tagName&&Ci(a,!0,this.Ma);}}
    function Ci(a,b,c){null!=c&&l.clearTimeout(c);a.onload=la;a.onerror=la;a.onreadystatechange=la;b&&window.setTimeout(function(){a&&a.parentNode&&a.parentNode.removeChild(a);},0);}var Fi=0,Ei=1;function Di(a,b){var c="Jsloader error (code #"+a+")";b&&(c+=": "+b);u.call(this,c);this.code=a;}r(Di,u);function Hi(a){this.f=a;}r(Hi,Ah);Hi.prototype.a=function(){return new this.f};Hi.prototype.b=function(){return {}};
    function Ii(a,b,c){this.c=a;a=b||{};this.l=a.secureTokenEndpoint||"https://securetoken.googleapis.com/v1/token";this.m=a.secureTokenTimeout||Ji;this.g=nb(a.secureTokenHeaders||Ki);this.h=a.firebaseEndpoint||"https://www.googleapis.com/identitytoolkit/v3/relyingparty/";this.i=a.identityPlatformEndpoint||"https://identitytoolkit.googleapis.com/v2/";this.v=a.firebaseTimeout||Li;this.a=nb(a.firebaseHeaders||Mi);c&&(this.a["X-Client-Version"]=c,this.g["X-Client-Version"]=c);c="Node"==Ke();c=l.XMLHttpRequest||
    c&&firebase$1.INTERNAL.node&&firebase$1.INTERNAL.node.XMLHttpRequest;if(!c&&!Je())throw new t("internal-error","The XMLHttpRequest compatibility library was not found.");this.f=void 0;Je()?this.f=new Vh(self):Le()?this.f=new Hi(c):this.f=new Fh;this.b=null;}var Ni,Dg="idToken",Ji=new Ze(3E4,6E4),Ki={"Content-Type":"application/x-www-form-urlencoded"},Li=new Ze(3E4,6E4),Mi={"Content-Type":"application/json"};function Oi(a,b){b?a.a["X-Firebase-Locale"]=b:delete a.a["X-Firebase-Locale"];}
    function Pi(a,b){b&&(a.l=Qi("https://securetoken.googleapis.com/v1/token",b),a.h=Qi("https://www.googleapis.com/identitytoolkit/v3/relyingparty/",b),a.i=Qi("https://identitytoolkit.googleapis.com/v2/",b));}function Qi(a,b){a=J(a);b=J(b.url);a.f=a.a+a.f;Pd(a,b.c);a.a=b.a;Qd(a,b.g);return a.toString()}function Ri(a,b){b?(a.a["X-Client-Version"]=b,a.g["X-Client-Version"]=b):(delete a.a["X-Client-Version"],delete a.g["X-Client-Version"]);}Ii.prototype.T=function(){return this.b};
    function Si(a,b,c,d,e,f,g){ue()||Je()?a=q(a.u,a):(Ni||(Ni=new D(function(h,m){Ti(h,m);})),a=q(a.s,a));a(b,c,d,e,f,g);}
    Ii.prototype.u=function(a,b,c,d,e,f){if(Je()&&("undefined"===typeof l.fetch||"undefined"===typeof l.Headers||"undefined"===typeof l.Request))throw new t("operation-not-supported-in-this-environment","fetch, Headers and Request native APIs or equivalent Polyfills must be available to support HTTP requests from a Worker environment.");var g=new ai(this.f);if(f){g.g=Math.max(0,f);var h=setTimeout(function(){g.dispatchEvent("timeout");},f);}qd(g,"complete",function(){h&&clearTimeout(h);var m=null;try{m=
    JSON.parse(oi(this))||null;}catch(p){m=null;}b&&b(m);});wd(g,"ready",function(){h&&clearTimeout(h);Xc(this);});wd(g,"timeout",function(){h&&clearTimeout(h);Xc(this);b&&b(null);});ei(g,a,c,d,e);};var Ui=new qb(rb,"https://apis.google.com/js/client.js?onload=%{onload}"),Vi="__fcb"+Math.floor(1E6*Math.random()).toString();
    function Ti(a,b){if(((window.gapi||{}).client||{}).request)a();else {l[Vi]=function(){((window.gapi||{}).client||{}).request?a():b(Error("CORS_UNSUPPORTED"));};var c=zb(Ui,{onload:Vi});wi(Bi(c),function(){b(Error("CORS_UNSUPPORTED"));});}}
    Ii.prototype.s=function(a,b,c,d,e){var f=this;Ni.then(function(){window.gapi.client.setApiKey(f.c);var g=window.gapi.auth.getToken();window.gapi.auth.setToken(null);window.gapi.client.request({path:a,method:c,body:d,headers:e,authType:"none",callback:function(h){window.gapi.auth.setToken(g);b&&b(h);}});}).o(function(g){b&&b({error:{message:g&&g.message||"CORS_UNSUPPORTED"}});});};
    function Wi(a,b){return new D(function(c,d){"refresh_token"==b.grant_type&&b.refresh_token||"authorization_code"==b.grant_type&&b.code?Si(a,a.l+"?key="+encodeURIComponent(a.c),function(e){e?e.error?d(Xi(e)):e.access_token&&e.refresh_token?c(e):d(new t("internal-error")):d(new t("network-request-failed"));},"POST",fe(b).toString(),a.g,a.m.get()):d(new t("internal-error"));})}
    function Yi(a,b,c,d,e,f,g){var h=J(b+c);I(h,"key",a.c);g&&I(h,"cb",va().toString());var m="GET"==d;if(m)for(var p in e)e.hasOwnProperty(p)&&I(h,p,e[p]);return new D(function(v,B){Si(a,h.toString(),function(A){A?A.error?B(Xi(A,f||{})):v(A):B(new t("network-request-failed"));},d,m?void 0:ke(Ve(e)),a.a,a.v.get());})}function Zi(a){a=a.email;if("string"!==typeof a||!De.test(a))throw new t("invalid-email");}function $i(a){"email"in a&&Zi(a);}
    function aj(a,b){return O(a,bj,{identifier:b,continueUri:Se()?re():"http://localhost"}).then(function(c){return c.signinMethods||[]})}function cj(a){return O(a,dj,{}).then(function(b){return b.authorizedDomains||[]})}function P(a){if(!a[Dg]){if(a.mfaPendingCredential)throw new t("multi-factor-auth-required",null,nb(a));throw new t("internal-error");}}
    function ej(a){if(a.phoneNumber||a.temporaryProof){if(!a.phoneNumber||!a.temporaryProof)throw new t("internal-error");}else {if(!a.sessionInfo)throw new t("missing-verification-id");if(!a.code)throw new t("missing-verification-code");}}Ii.prototype.zb=function(){return O(this,fj,{})};Ii.prototype.Bb=function(a,b){return O(this,gj,{idToken:a,email:b})};Ii.prototype.Cb=function(a,b){return O(this,ch,{idToken:a,password:b})};var hj={displayName:"DISPLAY_NAME",photoUrl:"PHOTO_URL"};k=Ii.prototype;
    k.Db=function(a,b){var c={idToken:a},d=[];lb(hj,function(e,f){var g=b[f];null===g?d.push(e):f in b&&(c[f]=g);});d.length&&(c.deleteAttribute=d);return O(this,gj,c)};k.vb=function(a,b){a={requestType:"PASSWORD_RESET",email:a};z(a,b);return O(this,ij,a)};k.wb=function(a,b){a={requestType:"EMAIL_SIGNIN",email:a};z(a,b);return O(this,jj,a)};k.ub=function(a,b){a={requestType:"VERIFY_EMAIL",idToken:a};z(a,b);return O(this,kj,a)};
    k.Eb=function(a,b,c){a={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:a,newEmail:b};z(a,c);return O(this,lj,a)};function oh(a,b){return O(a,mj,b)}k.fb=function(a){return O(this,nj,a)};function mh(a,b){return O(a,oj,b).then(function(c){return c.phoneSessionInfo.sessionInfo})}
    function pj(a){if(!a.phoneVerificationInfo)throw new t("internal-error");if(!a.phoneVerificationInfo.sessionInfo)throw new t("missing-verification-id");if(!a.phoneVerificationInfo.code)throw new t("missing-verification-code");}function nh(a,b){return O(a,qj,b).then(function(c){return c.phoneResponseInfo.sessionInfo})}function rj(a,b,c){return O(a,sj,{idToken:b,deleteProvider:c})}function tj(a){if(!a.requestUri||!a.sessionId&&!a.postBody&&!a.pendingToken)throw new t("internal-error");}
    function uj(a,b){b.oauthIdToken&&b.providerId&&0==b.providerId.indexOf("oidc.")&&!b.pendingToken&&(a.sessionId?b.nonce=a.sessionId:a.postBody&&(a=new Ud(a.postBody),je(a,"nonce")&&(b.nonce=a.get("nonce"))));return b}
    function vj(a){var b=null;a.needConfirmation?(a.code="account-exists-with-different-credential",b=zh(a)):"FEDERATED_USER_ID_ALREADY_LINKED"==a.errorMessage?(a.code="credential-already-in-use",b=zh(a)):"EMAIL_EXISTS"==a.errorMessage?(a.code="email-already-in-use",b=zh(a)):a.errorMessage&&(b=wj(a.errorMessage));if(b)throw b;P(a);}function Fg(a,b){b.returnIdpCredential=!0;return O(a,xj,b)}function Hg(a,b){b.returnIdpCredential=!0;return O(a,yj,b)}
    function Ig(a,b){b.returnIdpCredential=!0;b.autoCreate=!1;return O(a,zj,b)}function Aj(a){if(!a.oobCode)throw new t("invalid-action-code");}k.nb=function(a,b){return O(this,Bj,{oobCode:a,newPassword:b})};k.Ra=function(a){return O(this,Cj,{oobCode:a})};k.jb=function(a){return O(this,Dj,{oobCode:a})};
    var Dj={endpoint:"setAccountInfo",A:Aj,Z:"email",B:!0},Cj={endpoint:"resetPassword",A:Aj,G:function(a){var b=a.requestType;if(!b||!a.email&&"EMAIL_SIGNIN"!=b&&"VERIFY_AND_CHANGE_EMAIL"!=b)throw new t("internal-error");},B:!0},Ej={endpoint:"signupNewUser",A:function(a){Zi(a);if(!a.password)throw new t("weak-password");},G:P,V:!0,B:!0},bj={endpoint:"createAuthUri",B:!0},Fj={endpoint:"deleteAccount",N:["idToken"]},sj={endpoint:"setAccountInfo",N:["idToken","deleteProvider"],A:function(a){if(!Array.isArray(a.deleteProvider))throw new t("internal-error");
    }},$g={endpoint:"emailLinkSignin",N:["email","oobCode"],A:Zi,G:P,V:!0,B:!0},bh={endpoint:"emailLinkSignin",N:["idToken","email","oobCode"],A:Zi,G:P,V:!0},Gj={endpoint:"accounts/mfaEnrollment:finalize",N:["idToken","phoneVerificationInfo"],A:pj,G:P,B:!0,Na:!0},Hj={endpoint:"accounts/mfaSignIn:finalize",N:["mfaPendingCredential","phoneVerificationInfo"],A:pj,G:P,B:!0,Na:!0},Ij={endpoint:"getAccountInfo"},jj={endpoint:"getOobConfirmationCode",N:["requestType"],A:function(a){if("EMAIL_SIGNIN"!=a.requestType)throw new t("internal-error");
    Zi(a);},Z:"email",B:!0},kj={endpoint:"getOobConfirmationCode",N:["idToken","requestType"],A:function(a){if("VERIFY_EMAIL"!=a.requestType)throw new t("internal-error");},Z:"email",B:!0},lj={endpoint:"getOobConfirmationCode",N:["idToken","newEmail","requestType"],A:function(a){if("VERIFY_AND_CHANGE_EMAIL"!=a.requestType)throw new t("internal-error");},Z:"email",B:!0},ij={endpoint:"getOobConfirmationCode",N:["requestType"],A:function(a){if("PASSWORD_RESET"!=a.requestType)throw new t("internal-error");
    Zi(a);},Z:"email",B:!0},dj={lb:!0,endpoint:"getProjectConfig",Ub:"GET"},Jj={lb:!0,endpoint:"getRecaptchaParam",Ub:"GET",G:function(a){if(!a.recaptchaSiteKey)throw new t("internal-error");}},Bj={endpoint:"resetPassword",A:Aj,Z:"email",B:!0},mj={endpoint:"sendVerificationCode",N:["phoneNumber","recaptchaToken"],Z:"sessionInfo",B:!0},gj={endpoint:"setAccountInfo",N:["idToken"],A:$i,V:!0},ch={endpoint:"setAccountInfo",N:["idToken"],A:function(a){$i(a);if(!a.password)throw new t("weak-password");},G:P,
    V:!0},fj={endpoint:"signupNewUser",G:P,V:!0,B:!0},oj={endpoint:"accounts/mfaEnrollment:start",N:["idToken","phoneEnrollmentInfo"],A:function(a){if(!a.phoneEnrollmentInfo)throw new t("internal-error");if(!a.phoneEnrollmentInfo.phoneNumber)throw new t("missing-phone-number");if(!a.phoneEnrollmentInfo.recaptchaToken)throw new t("missing-app-credential");},G:function(a){if(!a.phoneSessionInfo||!a.phoneSessionInfo.sessionInfo)throw new t("internal-error");},B:!0,Na:!0},qj={endpoint:"accounts/mfaSignIn:start",
    N:["mfaPendingCredential","mfaEnrollmentId","phoneSignInInfo"],A:function(a){if(!a.phoneSignInInfo||!a.phoneSignInInfo.recaptchaToken)throw new t("missing-app-credential");},G:function(a){if(!a.phoneResponseInfo||!a.phoneResponseInfo.sessionInfo)throw new t("internal-error");},B:!0,Na:!0},xj={endpoint:"verifyAssertion",A:tj,Ya:uj,G:vj,V:!0,B:!0},zj={endpoint:"verifyAssertion",A:tj,Ya:uj,G:function(a){if(a.errorMessage&&"USER_NOT_FOUND"==a.errorMessage)throw new t("user-not-found");if(a.errorMessage)throw wj(a.errorMessage);
    P(a);},V:!0,B:!0},yj={endpoint:"verifyAssertion",A:function(a){tj(a);if(!a.idToken)throw new t("internal-error");},Ya:uj,G:vj,V:!0},Kj={endpoint:"verifyCustomToken",A:function(a){if(!a.token)throw new t("invalid-custom-token");},G:P,V:!0,B:!0},ah={endpoint:"verifyPassword",A:function(a){Zi(a);if(!a.password)throw new t("wrong-password");},G:P,V:!0,B:!0},nj={endpoint:"verifyPhoneNumber",A:ej,G:P,B:!0},ih={endpoint:"verifyPhoneNumber",A:function(a){if(!a.idToken)throw new t("internal-error");ej(a);},
    G:function(a){if(a.temporaryProof)throw a.code="credential-already-in-use",zh(a);P(a);}},jh={Hb:{USER_NOT_FOUND:"user-not-found"},endpoint:"verifyPhoneNumber",A:ej,G:P,B:!0},Lj={endpoint:"accounts/mfaEnrollment:withdraw",N:["idToken","mfaEnrollmentId"],G:function(a){if(!!a[Dg]^!!a.refreshToken)throw new t("internal-error");},B:!0,Na:!0};
    function O(a,b,c){if(!mf(c,b.N))return F(new t("internal-error"));var d=!!b.Na,e=b.Ub||"POST",f;return E(c).then(b.A).then(function(){b.V&&(c.returnSecureToken=!0);b.B&&a.b&&"undefined"===typeof c.tenantId&&(c.tenantId=a.b);return d?Yi(a,a.i,b.endpoint,e,c,b.Hb,b.lb||!1):Yi(a,a.h,b.endpoint,e,c,b.Hb,b.lb||!1)}).then(function(g){f=g;return b.Ya?b.Ya(c,f):f}).then(b.G).then(function(){if(!b.Z)return f;if(!(b.Z in f))throw new t("internal-error");return f[b.Z]})}
    function wj(a){return Xi({error:{errors:[{message:a}],code:400,message:a}})}
    function Xi(a,b){var c=(a.error&&a.error.errors&&a.error.errors[0]||{}).reason||"";var d={keyInvalid:"invalid-api-key",ipRefererBlocked:"app-not-authorized"};if(c=d[c]?new t(d[c]):null)return c;c=a.error&&a.error.message||"";d={INVALID_CUSTOM_TOKEN:"invalid-custom-token",CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_EMAIL:"invalid-email",INVALID_PASSWORD:"wrong-password",USER_DISABLED:"user-disabled",
    MISSING_PASSWORD:"internal-error",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_OR_INVALID_NONCE:"missing-or-invalid-nonce",INVALID_MESSAGE_PAYLOAD:"invalid-message-payload",INVALID_RECIPIENT_EMAIL:"invalid-recipient-email",INVALID_SENDER:"invalid-sender",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",
    EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",INVALID_PROVIDER_ID:"invalid-provider-id",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",CORS_UNSUPPORTED:"cors-unsupported",DYNAMIC_LINK_NOT_ACTIVATED:"dynamic-link-not-activated",INVALID_APP_ID:"invalid-app-id",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",WEAK_PASSWORD:"weak-password",
    OPERATION_NOT_ALLOWED:"operation-not-allowed",USER_CANCELLED:"user-cancelled",CAPTCHA_CHECK_FAILED:"captcha-check-failed",INVALID_APP_CREDENTIAL:"invalid-app-credential",INVALID_CODE:"invalid-verification-code",INVALID_PHONE_NUMBER:"invalid-phone-number",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_APP_CREDENTIAL:"missing-app-credential",MISSING_CODE:"missing-verification-code",MISSING_PHONE_NUMBER:"missing-phone-number",MISSING_SESSION_INFO:"missing-verification-id",
    QUOTA_EXCEEDED:"quota-exceeded",SESSION_EXPIRED:"code-expired",REJECTED_CREDENTIAL:"rejected-credential",INVALID_CONTINUE_URI:"invalid-continue-uri",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",MISSING_IOS_BUNDLE_ID:"missing-ios-bundle-id",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_DYNAMIC_LINK_DOMAIN:"invalid-dynamic-link-domain",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",INVALID_CERT_HASH:"invalid-cert-hash",UNSUPPORTED_TENANT_OPERATION:"unsupported-tenant-operation",
    INVALID_TENANT_ID:"invalid-tenant-id",TENANT_ID_MISMATCH:"tenant-id-mismatch",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",EMAIL_CHANGE_NEEDS_VERIFICATION:"email-change-needs-verification",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",
    UNSUPPORTED_FIRST_FACTOR:"unsupported-first-factor",UNVERIFIED_EMAIL:"unverified-email"};z(d,b||{});b=(b=c.match(/^[^\s]+\s*:\s*([\s\S]*)$/))&&1<b.length?b[1]:void 0;for(var e in d)if(0===c.indexOf(e))return new t(d[e],b);!b&&a&&(b=Ue(a));return new t("internal-error",b)}function Mj(a){this.b=a;this.a=null;this.rb=Nj(this);}
    function Nj(a){return Oj().then(function(){return new D(function(b,c){L("gapi.iframes.getContext")().open({where:document.body,url:a.b,messageHandlersFilter:L("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"),attributes:{style:{position:"absolute",top:"-100px",width:"1px",height:"1px"}},dontclear:!0},function(d){function e(){clearTimeout(f);b();}a.a=d;a.a.restyle({setHideOnLeave:!1});var f=setTimeout(function(){c(Error("Network Error"));},Pj.get());d.ping(e).then(e,function(){c(Error("Network Error"));});});})})}
    function Qj(a,b){return a.rb.then(function(){return new D(function(c){a.a.send(b.type,b,c,L("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));})})}function Rj(a,b){a.rb.then(function(){a.a.register("authEvent",b,L("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));});}var Sj=new qb(rb,"https://apis.google.com/js/api.js?onload=%{onload}"),Tj=new Ze(3E4,6E4),Pj=new Ze(5E3,15E3),Uj=null;
    function Oj(){return Uj?Uj:Uj=(new D(function(a,b){function c(){Ye();L("gapi.load")("gapi.iframes",{callback:a,ontimeout:function(){Ye();b(Error("Network Error"));},timeout:Tj.get()});}if(L("gapi.iframes.Iframe"))a();else if(L("gapi.load"))c();else {var d="__iframefcb"+Math.floor(1E6*Math.random()).toString();l[d]=function(){L("gapi.load")?c():b(Error("Network Error"));};d=zb(Sj,{onload:d});E(Bi(d)).o(function(){b(Error("Network Error"));});}})).o(function(a){Uj=null;throw a;})}function Vj(a,b,c,d){this.l=a;this.h=b;this.i=c;this.g=d;this.f=null;this.g?(a=J(this.g.url),a=ce(a.c,a.a,a.g,"/emulator/auth/iframe")):a=ce("https",this.l,null,"/__/auth/iframe");this.a=a;I(this.a,"apiKey",this.h);I(this.a,"appName",this.i);this.b=null;this.c=[];}Vj.prototype.toString=function(){this.f?I(this.a,"v",this.f):ie(this.a.b,"v");this.b?I(this.a,"eid",this.b):ie(this.a.b,"eid");this.c.length?I(this.a,"fw",this.c.join(",")):ie(this.a.b,"fw");return this.a.toString()};
    function Wj(a,b,c,d,e,f){this.u=a;this.s=b;this.c=c;this.m=d;this.v=f;this.i=this.g=this.l=null;this.a=e;this.h=this.f=null;}Wj.prototype.yb=function(a){this.h=a;return this};
    Wj.prototype.toString=function(){if(this.v){var a=J(this.v.url);a=ce(a.c,a.a,a.g,"/emulator/auth/handler");}else a=ce("https",this.u,null,"/__/auth/handler");I(a,"apiKey",this.s);I(a,"appName",this.c);I(a,"authType",this.m);if(this.a.isOAuthProvider){var b=this.a;try{var c=firebase$1.app(this.c).auth().la();}catch(h){c=null;}b.ob=c;I(a,"providerId",this.a.providerId);c=this.a;b=Ve(c.Ib);for(var d in b)b[d]=b[d].toString();d=c.Qc;b=nb(b);for(var e=0;e<d.length;e++){var f=d[e];f in b&&delete b[f];}c.pb&&
    c.ob&&!b[c.pb]&&(b[c.pb]=c.ob);mb(b)||I(a,"customParameters",Ue(b));}"function"===typeof this.a.Qb&&(c=this.a.Qb(),c.length&&I(a,"scopes",c.join(",")));this.l?I(a,"redirectUrl",this.l):ie(a.b,"redirectUrl");this.g?I(a,"eventId",this.g):ie(a.b,"eventId");this.i?I(a,"v",this.i):ie(a.b,"v");if(this.b)for(var g in this.b)this.b.hasOwnProperty(g)&&!be(a,g)&&I(a,g,this.b[g]);this.h?I(a,"tid",this.h):ie(a.b,"tid");this.f?I(a,"eid",this.f):ie(a.b,"eid");g=Xj(this.c);g.length&&I(a,"fw",g.join(","));return a.toString()};
    function Xj(a){try{return firebase$1.app(a).auth().Ga()}catch(b){return []}}function Yj(a,b,c,d,e,f){this.s=a;this.g=b;this.b=c;this.f=f;this.c=d||null;this.i=e||null;this.l=this.u=this.C=null;this.h=[];this.m=this.a=null;}
    function Zj(a){var b=re();return cj(a).then(function(c){a:{var d=J(b),e=d.c;d=d.a;for(var f=0;f<c.length;f++){var g=c[f];var h=d;var m=e;0==g.indexOf("chrome-extension://")?h=J(g).a==h&&"chrome-extension"==m:"http"!=m&&"https"!=m?h=!1:Ce.test(g)?h=h==g:(g=g.split(".").join("\\."),h=(new RegExp("^(.+\\."+g+"|"+g+")$","i")).test(h));if(h){c=!0;break a}}c=!1;}if(!c)throw new xh(re());})}
    function ak(a){if(a.m)return a.m;a.m=Ee().then(function(){if(!a.u){var b=a.c,c=a.i,d=Xj(a.b),e=new Vj(a.s,a.g,a.b,a.f);e.f=b;e.b=c;e.c=Za(d||[]);a.u=e.toString();}a.v=new Mj(a.u);bk(a);});return a.m}k=Yj.prototype;k.Ob=function(a,b,c){var d=new t("popup-closed-by-user"),e=new t("web-storage-unsupported"),f=this,g=!1;return this.ma().then(function(){ck(f).then(function(h){h||(a&&ye(a),b(e),g=!0);});}).o(function(){}).then(function(){if(!g)return Be(a)}).then(function(){if(!g)return Fd(c).then(function(){b(d);})})};
    k.Xb=function(){var a=K();return !Te(a)&&!Xe(a)};k.Tb=function(){return !1};
    k.Mb=function(a,b,c,d,e,f,g,h){if(!a)return F(new t("popup-blocked"));if(g&&!Te())return this.ma().o(function(p){ye(a);e(p);}),d(),E();this.a||(this.a=Zj(dk(this)));var m=this;return this.a.then(function(){var p=m.ma().o(function(v){ye(a);e(v);throw v;});d();return p}).then(function(){rh(c);if(!g){var p=ek(m.s,m.g,m.b,b,c,null,f,m.c,void 0,m.i,h,m.f);se(p,a);}}).o(function(p){"auth/network-request-failed"==p.code&&(m.a=null);throw p;})};
    function dk(a){a.l||(a.C=a.c?Oe(a.c,Xj(a.b)):null,a.l=new Ii(a.g,Ca(a.i),a.C),a.f&&Pi(a.l,a.f));return a.l}k.Nb=function(a,b,c,d){this.a||(this.a=Zj(dk(this)));var e=this;return this.a.then(function(){rh(b);var f=ek(e.s,e.g,e.b,a,b,re(),c,e.c,void 0,e.i,d,e.f);se(f);}).o(function(f){"auth/network-request-failed"==f.code&&(e.a=null);throw f;})};k.ma=function(){var a=this;return ak(this).then(function(){return a.v.rb}).o(function(){a.a=null;throw new t("network-request-failed");})};k.$b=function(){return !0};
    function ek(a,b,c,d,e,f,g,h,m,p,v,B){a=new Wj(a,b,c,d,e,B);a.l=f;a.g=g;a.i=h;a.b=nb(m||null);a.f=p;return a.yb(v).toString()}function bk(a){if(!a.v)throw Error("IfcHandler must be initialized!");Rj(a.v,function(b){var c={};if(b&&b.authEvent){var d=!1;b=th(b.authEvent);for(c=0;c<a.h.length;c++)d=a.h[c](b)||d;c={};c.status=d?"ACK":"ERROR";return E(c)}c.status="ERROR";return E(c)});}
    function ck(a){var b={type:"webStorageSupport"};return ak(a).then(function(){return Qj(a.v,b)}).then(function(c){if(c&&c.length&&"undefined"!==typeof c[0].webStorageSupport)return c[0].webStorageSupport;throw Error();})}k.Ea=function(a){this.h.push(a);};k.Sa=function(a){Xa(this.h,function(b){return b==a});};function fk(a){this.a=a||firebase$1.INTERNAL.reactNative&&firebase$1.INTERNAL.reactNative.AsyncStorage;if(!this.a)throw new t("internal-error","The React Native compatibility library was not found.");this.type="asyncStorage";}k=fk.prototype;k.get=function(a){return E(this.a.getItem(a)).then(function(b){return b&&We(b)})};k.set=function(a,b){return E(this.a.setItem(a,Ue(b)))};k.U=function(a){return E(this.a.removeItem(a))};k.ca=function(){};k.ia=function(){};function gk(a){this.b=a;this.a={};this.f=q(this.c,this);}var hk=[];function ik(){var a=Je()?self:null;w(hk,function(c){c.b==a&&(b=c);});if(!b){var b=new gk(a);hk.push(b);}return b}
    gk.prototype.c=function(a){var b=a.data.eventType,c=a.data.eventId,d=this.a[b];if(d&&0<d.length){a.ports[0].postMessage({status:"ack",eventId:c,eventType:b,response:null});var e=[];w(d,function(f){e.push(E().then(function(){return f(a.origin,a.data.data)}));});Jc(e).then(function(f){var g=[];w(f,function(h){g.push({fulfilled:h.Pb,value:h.value,reason:h.reason?h.reason.message:void 0});});w(g,function(h){for(var m in h)"undefined"===typeof h[m]&&delete h[m];});a.ports[0].postMessage({status:"done",eventId:c,
    eventType:b,response:g});});}};function jk(a,b,c){mb(a.a)&&a.b.addEventListener("message",a.f);"undefined"===typeof a.a[b]&&(a.a[b]=[]);a.a[b].push(c);}function kk(a){this.a=a;}kk.prototype.postMessage=function(a,b){this.a.postMessage(a,b);};function lk(a){this.c=a;this.b=!1;this.a=[];}
    function mk(a,b,c,d){var e,f=c||{},g,h,m,p=null;if(a.b)return F(Error("connection_unavailable"));var v=d?800:50,B="undefined"!==typeof MessageChannel?new MessageChannel:null;return (new D(function(A,Q){B?(e=Math.floor(Math.random()*Math.pow(10,20)).toString(),B.port1.start(),h=setTimeout(function(){Q(Error("unsupported_event"));},v),g=function(ya){ya.data.eventId===e&&("ack"===ya.data.status?(clearTimeout(h),m=setTimeout(function(){Q(Error("timeout"));},3E3)):"done"===ya.data.status?(clearTimeout(m),
    "undefined"!==typeof ya.data.response?A(ya.data.response):Q(Error("unknown_error"))):(clearTimeout(h),clearTimeout(m),Q(Error("invalid_response"))));},p={messageChannel:B,onMessage:g},a.a.push(p),B.port1.addEventListener("message",g),a.c.postMessage({eventType:b,eventId:e,data:f},[B.port2])):Q(Error("connection_unavailable"));})).then(function(A){nk(a,p);return A}).o(function(A){nk(a,p);throw A;})}
    function nk(a,b){if(b){var c=b.messageChannel,d=b.onMessage;c&&(c.port1.removeEventListener("message",d),c.port1.close());Xa(a.a,function(e){return e==b});}}lk.prototype.close=function(){for(;0<this.a.length;)nk(this,this.a[0]);this.b=!0;};function ok(){if(!pk())throw new t("web-storage-unsupported");this.c={};this.a=[];this.b=0;this.m=l.indexedDB;this.type="indexedDB";this.g=this.v=this.f=this.l=null;this.s=!1;this.h=null;var a=this;Je()&&self?(this.v=ik(),jk(this.v,"keyChanged",function(b,c){return qk(a).then(function(d){0<d.length&&w(a.a,function(e){e(d);});return {keyProcessed:Va(d,c.key)}})}),jk(this.v,"ping",function(){return E(["keyChanged"])})):ef().then(function(b){if(a.h=b)a.g=new lk(new kk(b)),mk(a.g,"ping",null,!0).then(function(c){c[0].fulfilled&&
    Va(c[0].value,"keyChanged")&&(a.s=!0);}).o(function(){});});}var rk;function sk(a){return new D(function(b,c){var d=a.m.deleteDatabase("firebaseLocalStorageDb");d.onsuccess=function(){b();};d.onerror=function(e){c(Error(e.target.error));};})}
    function tk(a){return new D(function(b,c){var d=a.m.open("firebaseLocalStorageDb",1);d.onerror=function(e){try{e.preventDefault();}catch(f){}c(Error(e.target.error));};d.onupgradeneeded=function(e){e=e.target.result;try{e.createObjectStore("firebaseLocalStorage",{keyPath:"fbase_key"});}catch(f){c(f);}};d.onsuccess=function(e){e=e.target.result;e.objectStoreNames.contains("firebaseLocalStorage")?b(e):sk(a).then(function(){return tk(a)}).then(function(f){b(f);}).o(function(f){c(f);});};})}
    function uk(a){a.i||(a.i=tk(a));return a.i}function vk(a,b){function c(e,f){uk(a).then(b).then(e).o(function(g){if(3<++d)f(g);else return uk(a).then(function(h){h.close();a.i=void 0;return c(e,f)}).o(function(h){f(h);})});}var d=0;return new D(c)}function pk(){try{return !!l.indexedDB}catch(a){return !1}}function wk(a){return a.objectStore("firebaseLocalStorage")}function xk(a,b){return a.transaction(["firebaseLocalStorage"],b?"readwrite":"readonly")}
    function yk(a){return new D(function(b,c){a.onsuccess=function(d){d&&d.target?b(d.target.result):b();};a.onerror=function(d){c(d.target.error);};})}k=ok.prototype;k.set=function(a,b){var c=this,d=!1;return vk(this,function(e){e=wk(xk(e,!0));return yk(e.get(a))}).then(function(e){return vk(c,function(f){f=wk(xk(f,!0));if(e)return e.value=b,yk(f.put(e));c.b++;d=!0;var g={};g.fbase_key=a;g.value=b;return yk(f.add(g))})}).then(function(){c.c[a]=b;return zk(c,a)}).oa(function(){d&&c.b--;})};
    function zk(a,b){return a.g&&a.h&&df()===a.h?mk(a.g,"keyChanged",{key:b},a.s).then(function(){}).o(function(){}):E()}k.get=function(a){return vk(this,function(b){return yk(wk(xk(b,!1)).get(a))}).then(function(b){return b&&b.value})};k.U=function(a){var b=this,c=!1;return vk(this,function(d){c=!0;b.b++;return yk(wk(xk(d,!0))["delete"](a))}).then(function(){delete b.c[a];return zk(b,a)}).oa(function(){c&&b.b--;})};
    function qk(a){return uk(a).then(function(b){var c=wk(xk(b,!1));return c.getAll?yk(c.getAll()):new D(function(d,e){var f=[],g=c.openCursor();g.onsuccess=function(h){(h=h.target.result)?(f.push(h.value),h["continue"]()):d(f);};g.onerror=function(h){e(h.target.error);};})}).then(function(b){var c={},d=[];if(0==a.b){for(d=0;d<b.length;d++)c[b[d].fbase_key]=b[d].value;d=te(a.c,c);a.c=c;}return d})}k.ca=function(a){0==this.a.length&&Ak(this);this.a.push(a);};
    k.ia=function(a){Xa(this.a,function(b){return b==a});0==this.a.length&&Bk(this);};function Ak(a){function b(){a.f=setTimeout(function(){a.l=qk(a).then(function(c){0<c.length&&w(a.a,function(d){d(c);});}).then(function(){b();}).o(function(c){"STOP_EVENT"!=c.message&&b();});},800);}Bk(a);b();}function Bk(a){a.l&&a.l.cancel("STOP_EVENT");a.f&&(clearTimeout(a.f),a.f=null);}function Ck(a){var b=this,c=null;this.a=[];this.type="indexedDB";this.c=a;this.b=E().then(function(){if(pk()){var d=Qe(),e="__sak"+d;rk||(rk=new ok);c=rk;return c.set(e,d).then(function(){return c.get(e)}).then(function(f){if(f!==d)throw Error("indexedDB not supported!");return c.U(e)}).then(function(){return c}).o(function(){return b.c})}return b.c}).then(function(d){b.type=d.type;d.ca(function(e){w(b.a,function(f){f(e);});});return d});}k=Ck.prototype;k.get=function(a){return this.b.then(function(b){return b.get(a)})};
    k.set=function(a,b){return this.b.then(function(c){return c.set(a,b)})};k.U=function(a){return this.b.then(function(b){return b.U(a)})};k.ca=function(a){this.a.push(a);};k.ia=function(a){Xa(this.a,function(b){return b==a});};function Dk(){this.a={};this.type="inMemory";}k=Dk.prototype;k.get=function(a){return E(this.a[a])};k.set=function(a,b){this.a[a]=b;return E()};k.U=function(a){delete this.a[a];return E()};k.ca=function(){};k.ia=function(){};function Ek(){if(!Fk()){if("Node"==Ke())throw new t("internal-error","The LocalStorage compatibility library was not found.");throw new t("web-storage-unsupported");}this.a=Gk()||firebase$1.INTERNAL.node.localStorage;this.type="localStorage";}function Gk(){try{var a=l.localStorage,b=Qe();a&&(a.setItem(b,"1"),a.removeItem(b));return a}catch(c){return null}}
    function Fk(){var a="Node"==Ke();a=Gk()||a&&firebase$1.INTERNAL.node&&firebase$1.INTERNAL.node.localStorage;if(!a)return !1;try{return a.setItem("__sak","1"),a.removeItem("__sak"),!0}catch(b){return !1}}k=Ek.prototype;k.get=function(a){var b=this;return E().then(function(){var c=b.a.getItem(a);return We(c)})};k.set=function(a,b){var c=this;return E().then(function(){var d=Ue(b);null===d?c.U(a):c.a.setItem(a,d);})};k.U=function(a){var b=this;return E().then(function(){b.a.removeItem(a);})};
    k.ca=function(a){l.window&&nd(l.window,"storage",a);};k.ia=function(a){l.window&&xd(l.window,"storage",a);};function Hk(){this.type="nullStorage";}k=Hk.prototype;k.get=function(){return E(null)};k.set=function(){return E()};k.U=function(){return E()};k.ca=function(){};k.ia=function(){};function Ik(){if(!Jk()){if("Node"==Ke())throw new t("internal-error","The SessionStorage compatibility library was not found.");throw new t("web-storage-unsupported");}this.a=Kk()||firebase$1.INTERNAL.node.sessionStorage;this.type="sessionStorage";}function Kk(){try{var a=l.sessionStorage,b=Qe();a&&(a.setItem(b,"1"),a.removeItem(b));return a}catch(c){return null}}
    function Jk(){var a="Node"==Ke();a=Kk()||a&&firebase$1.INTERNAL.node&&firebase$1.INTERNAL.node.sessionStorage;if(!a)return !1;try{return a.setItem("__sak","1"),a.removeItem("__sak"),!0}catch(b){return !1}}k=Ik.prototype;k.get=function(a){var b=this;return E().then(function(){var c=b.a.getItem(a);return We(c)})};k.set=function(a,b){var c=this;return E().then(function(){var d=Ue(b);null===d?c.U(a):c.a.setItem(a,d);})};k.U=function(a){var b=this;return E().then(function(){b.a.removeItem(a);})};k.ca=function(){};
    k.ia=function(){};function Lk(){var a={};a.Browser=Mk;a.Node=Nk;a.ReactNative=Ok;a.Worker=Pk;this.a=a[Ke()];}var Qk,Mk={F:Ek,bb:Ik},Nk={F:Ek,bb:Ik},Ok={F:fk,bb:Hk},Pk={F:Ek,bb:Hk};var Rk={rd:"local",NONE:"none",td:"session"};function Sk(a){var b=new t("invalid-persistence-type"),c=new t("unsupported-persistence-type");a:{for(d in Rk)if(Rk[d]==a){var d=!0;break a}d=!1;}if(!d||"string"!==typeof a)throw b;switch(Ke()){case "ReactNative":if("session"===a)throw c;break;case "Node":if("none"!==a)throw c;break;case "Worker":if("session"===a||!pk()&&"none"!==a)throw c;break;default:if(!Pe()&&"none"!==a)throw c;}}
    function Tk(){var a=!Xe(K())&&Ie()?!0:!1,b=Te(),c=Pe();this.m=a;this.h=b;this.l=c;this.a={};Qk||(Qk=new Lk);a=Qk;try{this.g=!qe()&&cf()||!l.indexedDB?new a.a.F:new Ck(Je()?new Dk:new a.a.F);}catch(d){this.g=new Dk,this.h=!0;}try{this.i=new a.a.bb;}catch(d){this.i=new Dk;}this.v=new Dk;this.f=q(this.Yb,this);this.b={};}var Uk;function Vk(){Uk||(Uk=new Tk);return Uk}function Wk(a,b){switch(b){case "session":return a.i;case "none":return a.v;default:return a.g}}
    function Xk(a,b){return "firebase:"+a.name+(b?":"+b:"")}function Yk(a,b,c){var d=Xk(b,c),e=Wk(a,b.F);return a.get(b,c).then(function(f){var g=null;try{g=We(l.localStorage.getItem(d));}catch(h){}if(g&&!f)return l.localStorage.removeItem(d),a.set(b,g,c);g&&f&&"localStorage"!=e.type&&l.localStorage.removeItem(d);})}k=Tk.prototype;k.get=function(a,b){return Wk(this,a.F).get(Xk(a,b))};function Zk(a,b,c){c=Xk(b,c);"local"==b.F&&(a.b[c]=null);return Wk(a,b.F).U(c)}
    k.set=function(a,b,c){var d=Xk(a,c),e=this,f=Wk(this,a.F);return f.set(d,b).then(function(){return f.get(d)}).then(function(g){"local"==a.F&&(e.b[d]=g);})};k.addListener=function(a,b,c){a=Xk(a,b);this.l&&(this.b[a]=l.localStorage.getItem(a));mb(this.a)&&(Wk(this,"local").ca(this.f),this.h||(qe()||!cf())&&l.indexedDB||!this.l||$k(this));this.a[a]||(this.a[a]=[]);this.a[a].push(c);};
    k.removeListener=function(a,b,c){a=Xk(a,b);this.a[a]&&(Xa(this.a[a],function(d){return d==c}),0==this.a[a].length&&delete this.a[a]);mb(this.a)&&(Wk(this,"local").ia(this.f),al(this));};function $k(a){al(a);a.c=setInterval(function(){for(var b in a.a){var c=l.localStorage.getItem(b),d=a.b[b];c!=d&&(a.b[b]=c,c=new bd({type:"storage",key:b,target:window,oldValue:d,newValue:c,a:!0}),a.Yb(c));}},1E3);}function al(a){a.c&&(clearInterval(a.c),a.c=null);}
    k.Yb=function(a){if(a&&a.g){var b=a.a.key;if(null==b)for(var c in this.a){var d=this.b[c];"undefined"===typeof d&&(d=null);var e=l.localStorage.getItem(c);e!==d&&(this.b[c]=e,this.mb(c));}else if(0==b.indexOf("firebase:")&&this.a[b]){"undefined"!==typeof a.a.a?Wk(this,"local").ia(this.f):al(this);if(this.m)if(c=l.localStorage.getItem(b),d=a.a.newValue,d!==c)null!==d?l.localStorage.setItem(b,d):l.localStorage.removeItem(b);else if(this.b[b]===d&&"undefined"===typeof a.a.a)return;var f=this;c=function(){if("undefined"!==
    typeof a.a.a||f.b[b]!==l.localStorage.getItem(b))f.b[b]=l.localStorage.getItem(b),f.mb(b);};Wb&&ic&&10==ic&&l.localStorage.getItem(b)!==a.a.newValue&&a.a.newValue!==a.a.oldValue?setTimeout(c,10):c();}}else w(a,q(this.mb,this));};k.mb=function(a){this.a[a]&&w(this.a[a],function(b){b();});};function bl(a){this.a=a;this.b=Vk();}var cl={name:"authEvent",F:"local"};function dl(a){return a.b.get(cl,a.a).then(function(b){return th(b)})}function el(){this.a=Vk();}function fl(){this.b=-1;}function gl(a,b){this.b=hl;this.f=l.Uint8Array?new Uint8Array(this.b):Array(this.b);this.g=this.c=0;this.a=[];this.i=a;this.h=b;this.l=l.Int32Array?new Int32Array(64):Array(64);void 0===il&&(l.Int32Array?il=new Int32Array(jl):il=jl);this.reset();}var il;r(gl,fl);for(var hl=64,kl=hl-1,ll=[],ml=0;ml<kl;ml++)ll[ml]=0;var nl=Ya(128,ll);gl.prototype.reset=function(){this.g=this.c=0;this.a=l.Int32Array?new Int32Array(this.h):Za(this.h);};
    function ol(a){for(var b=a.f,c=a.l,d=0,e=0;e<b.length;)c[d++]=b[e]<<24|b[e+1]<<16|b[e+2]<<8|b[e+3],e=4*d;for(b=16;64>b;b++){e=c[b-15]|0;d=c[b-2]|0;var f=(c[b-16]|0)+((e>>>7|e<<25)^(e>>>18|e<<14)^e>>>3)|0,g=(c[b-7]|0)+((d>>>17|d<<15)^(d>>>19|d<<13)^d>>>10)|0;c[b]=f+g|0;}d=a.a[0]|0;e=a.a[1]|0;var h=a.a[2]|0,m=a.a[3]|0,p=a.a[4]|0,v=a.a[5]|0,B=a.a[6]|0;f=a.a[7]|0;for(b=0;64>b;b++){var A=((d>>>2|d<<30)^(d>>>13|d<<19)^(d>>>22|d<<10))+(d&e^d&h^e&h)|0;g=p&v^~p&B;f=f+((p>>>6|p<<26)^(p>>>11|p<<21)^(p>>>25|p<<
    7))|0;g=g+(il[b]|0)|0;g=f+(g+(c[b]|0)|0)|0;f=B;B=v;v=p;p=m+g|0;m=h;h=e;e=d;d=g+A|0;}a.a[0]=a.a[0]+d|0;a.a[1]=a.a[1]+e|0;a.a[2]=a.a[2]+h|0;a.a[3]=a.a[3]+m|0;a.a[4]=a.a[4]+p|0;a.a[5]=a.a[5]+v|0;a.a[6]=a.a[6]+B|0;a.a[7]=a.a[7]+f|0;}
    function pl(a,b,c){void 0===c&&(c=b.length);var d=0,e=a.c;if("string"===typeof b)for(;d<c;)a.f[e++]=b.charCodeAt(d++),e==a.b&&(ol(a),e=0);else if(na(b))for(;d<c;){var f=b[d++];if(!("number"==typeof f&&0<=f&&255>=f&&f==(f|0)))throw Error("message must be a byte array");a.f[e++]=f;e==a.b&&(ol(a),e=0);}else throw Error("message must be string or array");a.c=e;a.g+=c;}
    var jl=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,
    4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function ql(){gl.call(this,8,rl);}r(ql,gl);var rl=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];function sl(a,b,c,d,e,f){this.v=a;this.i=b;this.l=c;this.m=d||null;this.u=e||null;this.s=f;this.h=b+":"+c;this.C=new el;this.g=new bl(this.h);this.f=null;this.b=[];this.a=this.c=null;}function tl(a){return new t("invalid-cordova-configuration",a)}k=sl.prototype;
    k.ma=function(){return this.Ia?this.Ia:this.Ia=Fe().then(function(){if("function"!==typeof L("universalLinks.subscribe",l))throw tl("cordova-universal-links-plugin-fix is not installed");if("undefined"===typeof L("BuildInfo.packageName",l))throw tl("cordova-plugin-buildinfo is not installed");if("function"!==typeof L("cordova.plugins.browsertab.openUrl",l))throw tl("cordova-plugin-browsertab is not installed");if("function"!==typeof L("cordova.InAppBrowser.open",l))throw tl("cordova-plugin-inappbrowser is not installed");
    },function(){throw new t("cordova-not-ready");})};function ul(){for(var a=20,b=[];0<a;)b.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62*Math.random()))),a--;return b.join("")}function vl(a){var b=new ql;pl(b,a);a=[];var c=8*b.g;56>b.c?pl(b,nl,56-b.c):pl(b,nl,b.b-(b.c-56));for(var d=63;56<=d;d--)b.f[d]=c&255,c/=256;ol(b);for(d=c=0;d<b.i;d++)for(var e=24;0<=e;e-=8)a[c++]=b.a[d]>>e&255;return cg(a)}
    k.Ob=function(a,b){b(new t("operation-not-supported-in-this-environment"));return E()};k.Mb=function(){return F(new t("operation-not-supported-in-this-environment"))};k.$b=function(){return !1};k.Xb=function(){return !0};k.Tb=function(){return !0};
    k.Nb=function(a,b,c,d){if(this.c)return F(new t("redirect-operation-pending"));var e=this,f=l.document,g=null,h=null,m=null,p=null;return this.c=E().then(function(){rh(b);return wl(e)}).then(function(){return xl(e,a,b,c,d)}).then(function(){return (new D(function(v,B){h=function(){var A=L("cordova.plugins.browsertab.close",l);v();"function"===typeof A&&A();e.a&&"function"===typeof e.a.close&&(e.a.close(),e.a=null);return !1};e.Ea(h);m=function(){g||(g=Fd(2E3).then(function(){B(new t("redirect-cancelled-by-user"));}));};
    p=function(){$e()&&m();};f.addEventListener("resume",m,!1);K().toLowerCase().match(/android/)||f.addEventListener("visibilitychange",p,!1);})).o(function(v){return yl(e).then(function(){throw v;})})}).oa(function(){m&&f.removeEventListener("resume",m,!1);p&&f.removeEventListener("visibilitychange",p,!1);g&&g.cancel();h&&e.Sa(h);e.c=null;})};
    function xl(a,b,c,d,e){var f=ul(),g=new sh(b,d,null,f,new t("no-auth-event"),null,e),h=L("BuildInfo.packageName",l);if("string"!==typeof h)throw new t("invalid-cordova-configuration");var m=L("BuildInfo.displayName",l),p={};if(K().toLowerCase().match(/iphone|ipad|ipod/))p.ibi=h;else if(K().toLowerCase().match(/android/))p.apn=h;else return F(new t("operation-not-supported-in-this-environment"));m&&(p.appDisplayName=m);f=vl(f);p.sessionId=f;var v=ek(a.v,a.i,a.l,b,c,null,d,a.m,p,a.u,e,a.s);return a.ma().then(function(){var B=
    a.h;return a.C.a.set(cl,g.w(),B)}).then(function(){var B=L("cordova.plugins.browsertab.isAvailable",l);if("function"!==typeof B)throw new t("invalid-cordova-configuration");var A=null;B(function(Q){if(Q){A=L("cordova.plugins.browsertab.openUrl",l);if("function"!==typeof A)throw new t("invalid-cordova-configuration");A(v);}else {A=L("cordova.InAppBrowser.open",l);if("function"!==typeof A)throw new t("invalid-cordova-configuration");Q=K();a.a=A(v,Q.match(/(iPad|iPhone|iPod).*OS 7_\d/i)||Q.match(/(iPad|iPhone|iPod).*OS 8_\d/i)?
    "_blank":"_system","location=yes");}});})}function zl(a,b){for(var c=0;c<a.b.length;c++)try{a.b[c](b);}catch(d){}}function wl(a){a.f||(a.f=a.ma().then(function(){return new D(function(b){function c(d){b(d);a.Sa(c);return !1}a.Ea(c);Al(a);})}));return a.f}function yl(a){var b=null;return dl(a.g).then(function(c){b=c;c=a.g;return Zk(c.b,cl,c.a)}).then(function(){return b})}
    function Al(a){function b(g){d=!0;e&&e.cancel();yl(a).then(function(h){var m=c;if(h&&g&&g.url){var p=null;m=xg(g.url);-1!=m.indexOf("/__/auth/callback")&&(p=J(m),p=We(be(p,"firebaseError")||null),p=(p="object"===typeof p?Aa(p):null)?new sh(h.c,h.b,null,null,p,null,h.T()):new sh(h.c,h.b,m,h.f,null,null,h.T()));m=p||c;}zl(a,m);});}var c=new sh("unknown",null,null,null,new t("no-auth-event")),d=!1,e=Fd(500).then(function(){return yl(a).then(function(){d||zl(a,c);})}),f=l.handleOpenURL;l.handleOpenURL=function(g){0==
    g.toLowerCase().indexOf(L("BuildInfo.packageName",l).toLowerCase()+"://")&&b({url:g});if("function"===typeof f)try{f(g);}catch(h){console.error(h);}};vh||(vh=new uh);wh(b);}k.Ea=function(a){this.b.push(a);wl(this).o(function(b){"auth/invalid-cordova-configuration"===b.code&&(b=new sh("unknown",null,null,null,new t("no-auth-event")),a(b));});};k.Sa=function(a){Xa(this.b,function(b){return b==a});};function Bl(a){this.a=a;this.b=Vk();}var Cl={name:"pendingRedirect",F:"session"};function Dl(a){return a.b.set(Cl,"pending",a.a)}function El(a){return Zk(a.b,Cl,a.a)}function Fl(a){return a.b.get(Cl,a.a).then(function(b){return "pending"==b})}function Gl(a,b,c,d){this.i={};this.u=0;this.D=a;this.v=b;this.m=c;this.J=d;this.h=[];this.f=!1;this.l=q(this.s,this);this.b=new Hl;this.C=new Il;this.g=new Bl(Jl(this.v,this.m));this.c={};this.c.unknown=this.b;this.c.signInViaRedirect=this.b;this.c.linkViaRedirect=this.b;this.c.reauthViaRedirect=this.b;this.c.signInViaPopup=this.C;this.c.linkViaPopup=this.C;this.c.reauthViaPopup=this.C;this.a=Kl(this.D,this.v,this.m,Da,this.J);}
    function Kl(a,b,c,d,e){var f=firebase$1.SDK_VERSION||null;return Ge()?new sl(a,b,c,f,d,e):new Yj(a,b,c,f,d,e)}Gl.prototype.reset=function(){this.f=!1;this.a.Sa(this.l);this.a=Kl(this.D,this.v,this.m,null,this.J);this.i={};};function Ll(a){a.f||(a.f=!0,a.a.Ea(a.l));var b=a.a;return a.a.ma().o(function(c){a.a==b&&a.reset();throw c;})}
    function Ml(a){a.a.Xb()&&Ll(a).o(function(b){var c=new sh("unknown",null,null,null,new t("operation-not-supported-in-this-environment"));Nl(b)&&a.s(c);});a.a.Tb()||Ol(a.b);}function Pl(a,b){Va(a.h,b)||a.h.push(b);a.f||Fl(a.g).then(function(c){c?El(a.g).then(function(){Ll(a).o(function(d){var e=new sh("unknown",null,null,null,new t("operation-not-supported-in-this-environment"));Nl(d)&&a.s(e);});}):Ml(a);}).o(function(){Ml(a);});}function Ql(a,b){Xa(a.h,function(c){return c==b});}
    Gl.prototype.s=function(a){if(!a)throw new t("invalid-auth-event");6E5<=va()-this.u&&(this.i={},this.u=0);if(a&&a.getUid()&&this.i.hasOwnProperty(a.getUid()))return !1;for(var b=!1,c=0;c<this.h.length;c++){var d=this.h[c];if(d.Fb(a.c,a.b)){if(b=this.c[a.c])b.h(a,d),a&&(a.f||a.b)&&(this.i[a.getUid()]=!0,this.u=va());b=!0;break}}Ol(this.b);return b};var Rl=new Ze(2E3,1E4),Sl=new Ze(3E4,6E4);Gl.prototype.qa=function(){return this.b.qa()};
    function Tl(a,b,c,d,e,f,g){return a.a.Mb(b,c,d,function(){a.f||(a.f=!0,a.a.Ea(a.l));},function(){a.reset();},e,f,g)}function Nl(a){return a&&"auth/cordova-not-ready"==a.code?!0:!1}
    function Ul(a,b,c,d,e){var f;return Dl(a.g).then(function(){return a.a.Nb(b,c,d,e).o(function(g){if(Nl(g))throw new t("operation-not-supported-in-this-environment");f=g;return El(a.g).then(function(){throw f;})}).then(function(){return a.a.$b()?new D(function(){}):El(a.g).then(function(){return a.qa()}).then(function(){}).o(function(){})})})}function Vl(a,b,c,d,e){return a.a.Ob(d,function(f){b.na(c,null,f,e);},Rl.get())}var Wl={};function Jl(a,b,c){a=a+":"+b;c&&(a=a+":"+c.url);return a}
    function Xl(a,b,c,d){var e=Jl(b,c,d);Wl[e]||(Wl[e]=new Gl(a,b,c,d));return Wl[e]}function Hl(){this.b=null;this.f=[];this.c=[];this.a=null;this.i=this.g=!1;}Hl.prototype.reset=function(){this.b=null;this.a&&(this.a.cancel(),this.a=null);};
    Hl.prototype.h=function(a,b){if(a){this.reset();this.g=!0;var c=a.c,d=a.b,e=a.a&&"auth/web-storage-unsupported"==a.a.code,f=a.a&&"auth/operation-not-supported-in-this-environment"==a.a.code;this.i=!(!e&&!f);"unknown"!=c||e||f?a.a?(Yl(this,!0,null,a.a),E()):b.Fa(c,d)?Zl(this,a,b):F(new t("invalid-auth-event")):(Yl(this,!1,null,null),E());}else F(new t("invalid-auth-event"));};function Ol(a){a.g||(a.g=!0,Yl(a,!1,null,null));}function $l(a){a.g&&!a.i&&Yl(a,!1,null,null);}
    function Zl(a,b,c){c=c.Fa(b.c,b.b);var d=b.g,e=b.f,f=b.i,g=b.T(),h=!!b.c.match(/Redirect$/);c(d,e,g,f).then(function(m){Yl(a,h,m,null);}).o(function(m){Yl(a,h,null,m);});}function am(a,b){a.b=function(){return F(b)};if(a.c.length)for(var c=0;c<a.c.length;c++)a.c[c](b);}function bm(a,b){a.b=function(){return E(b)};if(a.f.length)for(var c=0;c<a.f.length;c++)a.f[c](b);}function Yl(a,b,c,d){b?d?am(a,d):bm(a,c):bm(a,{user:null});a.f=[];a.c=[];}
    Hl.prototype.qa=function(){var a=this;return new D(function(b,c){a.b?a.b().then(b,c):(a.f.push(b),a.c.push(c),cm(a));})};function cm(a){var b=new t("timeout");a.a&&a.a.cancel();a.a=Fd(Sl.get()).then(function(){a.b||(a.g=!0,Yl(a,!0,null,b));});}function Il(){}Il.prototype.h=function(a,b){if(a){var c=a.c,d=a.b;a.a?(b.na(a.c,null,a.a,a.b),E()):b.Fa(c,d)?dm(a,b):F(new t("invalid-auth-event"));}else F(new t("invalid-auth-event"));};
    function dm(a,b){var c=a.b,d=a.c;b.Fa(d,c)(a.g,a.f,a.T(),a.i).then(function(e){b.na(d,e,null,c);}).o(function(e){b.na(d,null,e,c);});}function em(){this.ib=!1;Object.defineProperty(this,"appVerificationDisabled",{get:function(){return this.ib},set:function(a){this.ib=a;},enumerable:!1});}function fm(a,b){this.a=b;M(this,"verificationId",a);}fm.prototype.confirm=function(a){a=ph(this.verificationId,a);return this.a(a)};function gm(a,b,c,d){return (new lh(a)).fb(b,c).then(function(e){return new fm(e,d)})}function hm(a){var b=ig(a);if(!(b&&b.exp&&b.auth_time&&b.iat))throw new t("internal-error","An internal error occurred. The token obtained by Firebase appears to be malformed. Please retry the operation.");N(this,{token:a,expirationTime:bf(1E3*b.exp),authTime:bf(1E3*b.auth_time),issuedAtTime:bf(1E3*b.iat),signInProvider:b.firebase&&b.firebase.sign_in_provider?b.firebase.sign_in_provider:null,signInSecondFactor:b.firebase&&b.firebase.sign_in_second_factor?b.firebase.sign_in_second_factor:null,claims:b});}
    function im(a,b,c){var d=b&&b[jm];if(!d)throw new t("argument-error","Internal assert: Invalid MultiFactorResolver");this.a=a;this.f=nb(b);this.g=c;this.c=new yg(null,d);this.b=[];var e=this;w(b[km]||[],function(f){(f=tf(f))&&e.b.push(f);});M(this,"auth",this.a);M(this,"session",this.c);M(this,"hints",this.b);}var km="mfaInfo",jm="mfaPendingCredential";im.prototype.Rc=function(a){var b=this;return a.sb(this.a.a,this.c).then(function(c){var d=nb(b.f);delete d[km];delete d[jm];z(d,c);return b.g(d)})};function lm(a,b,c,d){t.call(this,"multi-factor-auth-required",d,b);this.b=new im(a,b,c);M(this,"resolver",this.b);}r(lm,t);function mm(a,b,c){if(a&&n(a.serverResponse)&&"auth/multi-factor-auth-required"===a.code)try{return new lm(b,a.serverResponse,c,a.message)}catch(d){}return null}function nm(){}nm.prototype.sb=function(a,b,c){return b.type==zg?om(this,a,b,c):pm(this,a,b)};function om(a,b,c,d){return c.Ha().then(function(e){e={idToken:e};"undefined"!==typeof d&&(e.displayName=d);z(e,{phoneVerificationInfo:hh(a.a)});return O(b,Gj,e)})}function pm(a,b,c){return c.Ha().then(function(d){d={mfaPendingCredential:d};z(d,{phoneVerificationInfo:hh(a.a)});return O(b,Hj,d)})}function qm(a){M(this,"factorId",a.fa);this.a=a;}r(qm,nm);
    function rm(a){qm.call(this,a);if(this.a.fa!=lh.PROVIDER_ID)throw new t("argument-error","firebase.auth.PhoneMultiFactorAssertion requires a valid firebase.auth.PhoneAuthCredential");}r(rm,qm);function sm(a,b){G.call(this,a);for(var c in b)this[c]=b[c];}r(sm,G);function tm(a,b){this.a=a;this.b=[];this.c=q(this.yc,this);nd(this.a,"userReloaded",this.c);var c=[];b&&b.multiFactor&&b.multiFactor.enrolledFactors&&w(b.multiFactor.enrolledFactors,function(d){var e=null,f={};if(d){d.uid&&(f[qf]=d.uid);d.displayName&&(f[rf]=d.displayName);d.enrollmentTime&&(f[sf]=(new Date(d.enrollmentTime)).toISOString());d.phoneNumber&&(f[pf]=d.phoneNumber);try{e=new uf(f);}catch(g){}d=e;}else d=null;d&&c.push(d);});um(this,c);}
    function vm(a){var b=[];w(a.mfaInfo||[],function(c){(c=tf(c))&&b.push(c);});return b}k=tm.prototype;k.yc=function(a){um(this,vm(a.hd));};function um(a,b){a.b=b;M(a,"enrolledFactors",b);}k.Rb=function(){return this.a.I().then(function(a){return new yg(a,null)})};k.fc=function(a,b){var c=this,d=this.a.a;return this.Rb().then(function(e){return a.sb(d,e,b)}).then(function(e){wm(c.a,e);return c.a.reload()})};
    k.bd=function(a){var b=this,c="string"===typeof a?a:a.uid,d=this.a.a;return this.a.I().then(function(e){return O(d,Lj,{idToken:e,mfaEnrollmentId:c})}).then(function(e){var f=Qa(b.b,function(g){return g.uid!=c});um(b,f);wm(b.a,e);return b.a.reload().o(function(g){if("auth/user-token-expired"!=g.code)throw g;})})};k.w=function(){return {multiFactor:{enrolledFactors:Ra(this.b,function(a){return a.w()})}}};function xm(a,b,c){this.h=a;this.i=b;this.g=c;this.c=3E4;this.f=96E4;this.b=null;this.a=this.c;if(this.f<this.c)throw Error("Proactive refresh lower bound greater than upper bound!");}xm.prototype.start=function(){this.a=this.c;ym(this,!0);};function zm(a,b){if(b)return a.a=a.c,a.g();b=a.a;a.a*=2;a.a>a.f&&(a.a=a.f);return b}function ym(a,b){a.stop();a.b=Fd(zm(a,b)).then(function(){return af()}).then(function(){return a.h()}).then(function(){ym(a,!0);}).o(function(c){a.i(c)&&ym(a,!1);});}
    xm.prototype.stop=function(){this.b&&(this.b.cancel(),this.b=null);};function Am(a){this.f=a;this.b=this.a=null;this.c=Date.now();}Am.prototype.w=function(){return {apiKey:this.f.c,refreshToken:this.a,accessToken:this.b&&this.b.toString(),expirationTime:this.c}};function Bm(a,b){"undefined"===typeof b&&(a.b?(b=a.b,b=b.a-b.g):b=0);a.c=Date.now()+1E3*b;}function Cm(a,b){a.b=jg(b[Dg]||"");a.a=b.refreshToken;b=b.expiresIn;Bm(a,"undefined"!==typeof b?Number(b):void 0);}function Dm(a,b){a.b=b.b;a.a=b.a;a.c=b.c;}
    function Em(a,b){return Wi(a.f,b).then(function(c){a.b=jg(c.access_token);a.a=c.refresh_token;Bm(a,c.expires_in);return {accessToken:a.b.toString(),refreshToken:a.a}}).o(function(c){"auth/user-token-expired"==c.code&&(a.a=null);throw c;})}Am.prototype.getToken=function(a){a=!!a;return this.b&&!this.a?F(new t("user-token-expired")):a||!this.b||Date.now()>this.c-3E4?this.a?Em(this,{grant_type:"refresh_token",refresh_token:this.a}):E(null):E({accessToken:this.b.toString(),refreshToken:this.a})};function Fm(a,b){this.a=a||null;this.b=b||null;N(this,{lastSignInTime:bf(b||null),creationTime:bf(a||null)});}function Gm(a){return new Fm(a.a,a.b)}Fm.prototype.w=function(){return {lastLoginAt:this.b,createdAt:this.a}};function Hm(a,b,c,d,e,f){N(this,{uid:a,displayName:d||null,photoURL:e||null,email:c||null,phoneNumber:f||null,providerId:b});}
    function Im(a,b,c){this.J=[];this.l=a.apiKey;this.m=a.appName;this.s=a.authDomain||null;var d=firebase$1.SDK_VERSION?Oe(firebase$1.SDK_VERSION):null;this.a=new Ii(this.l,Ca(Da),d);a.emulatorConfig&&Pi(this.a,a.emulatorConfig);this.b=new Am(this.a);Jm(this,b[Dg]);Cm(this.b,b);M(this,"refreshToken",this.b.a);Km(this,c||{});H.call(this);this.R=!1;this.s&&Re()&&(this.i=Xl(this.s,this.l,this.m));this.S=[];this.h=null;this.u=Lm(this);this.aa=q(this.hb,this);var e=this;this.ya=null;this.Oa=function(f){e.wa(f.h);};
    this.ja=null;this.Aa=function(f){Pi(e.a,f.c);};this.X=null;this.$=[];this.Ba=function(f){Mm(e,f.f);};this.ba=null;this.O=new tm(this,c);M(this,"multiFactor",this.O);}r(Im,H);Im.prototype.wa=function(a){this.ya=a;Oi(this.a,a);};Im.prototype.la=function(){return this.ya};function Nm(a,b){a.ja&&xd(a.ja,"languageCodeChanged",a.Oa);(a.ja=b)&&nd(b,"languageCodeChanged",a.Oa);}function Om(a,b){a.X&&xd(a.X,"emulatorConfigChanged",a.Aa);(a.X=b)&&nd(b,"emulatorConfigChanged",a.Aa);}
    function Mm(a,b){a.$=b;Ri(a.a,firebase$1.SDK_VERSION?Oe(firebase$1.SDK_VERSION,a.$):null);}Im.prototype.Ga=function(){return Za(this.$)};function Pm(a,b){a.ba&&xd(a.ba,"frameworkChanged",a.Ba);(a.ba=b)&&nd(b,"frameworkChanged",a.Ba);}Im.prototype.hb=function(){this.u.b&&(this.u.stop(),this.u.start());};function Qm(a){try{return firebase$1.app(a.m).auth()}catch(b){throw new t("internal-error","No firebase.auth.Auth instance is available for the Firebase App '"+a.m+"'!");}}
    function Lm(a){return new xm(function(){return a.I(!0)},function(b){return b&&"auth/network-request-failed"==b.code?!0:!1},function(){var b=a.b.c-Date.now()-3E5;return 0<b?b:0})}function Rm(a){a.D||a.u.b||(a.u.start(),xd(a,"tokenChanged",a.aa),nd(a,"tokenChanged",a.aa));}function Sm(a){xd(a,"tokenChanged",a.aa);a.u.stop();}function Jm(a,b){a.za=b;M(a,"_lat",b);}function Tm(a,b){Xa(a.S,function(c){return c==b});}
    function Um(a){for(var b=[],c=0;c<a.S.length;c++)b.push(a.S[c](a));return Jc(b).then(function(){return a})}function Vm(a){a.i&&!a.R&&(a.R=!0,Pl(a.i,a));}function Km(a,b){N(a,{uid:b.uid,displayName:b.displayName||null,photoURL:b.photoURL||null,email:b.email||null,emailVerified:b.emailVerified||!1,phoneNumber:b.phoneNumber||null,isAnonymous:b.isAnonymous||!1,tenantId:b.tenantId||null,metadata:new Fm(b.createdAt,b.lastLoginAt),providerData:[]});a.a.b=a.tenantId;}M(Im.prototype,"providerId","firebase");
    function Wm(){}function Xm(a){return E().then(function(){if(a.D)throw new t("app-deleted");})}function Ym(a){return Ra(a.providerData,function(b){return b.providerId})}function Zm(a,b){b&&($m(a,b.providerId),a.providerData.push(b));}function $m(a,b){Xa(a.providerData,function(c){return c.providerId==b});}function an(a,b,c){("uid"!=b||c)&&a.hasOwnProperty(b)&&M(a,b,c);}
    function bn(a,b){a!=b&&(N(a,{uid:b.uid,displayName:b.displayName,photoURL:b.photoURL,email:b.email,emailVerified:b.emailVerified,phoneNumber:b.phoneNumber,isAnonymous:b.isAnonymous,tenantId:b.tenantId,providerData:[]}),b.metadata?M(a,"metadata",Gm(b.metadata)):M(a,"metadata",new Fm),w(b.providerData,function(c){Zm(a,c);}),Dm(a.b,b.b),M(a,"refreshToken",a.b.a),um(a.O,b.O.b));}k=Im.prototype;k.reload=function(){var a=this;return R(this,Xm(this).then(function(){return cn(a).then(function(){return Um(a)}).then(Wm)}))};
    function cn(a){return a.I().then(function(b){var c=a.isAnonymous;return dn(a,b).then(function(){c||an(a,"isAnonymous",!1);return b})})}k.oc=function(a){return this.I(a).then(function(b){return new hm(b)})};k.I=function(a){var b=this;return R(this,Xm(this).then(function(){return b.b.getToken(a)}).then(function(c){if(!c)throw new t("internal-error");c.accessToken!=b.za&&(Jm(b,c.accessToken),b.dispatchEvent(new sm("tokenChanged")));an(b,"refreshToken",c.refreshToken);return c.accessToken}))};
    function wm(a,b){b[Dg]&&a.za!=b[Dg]&&(Cm(a.b,b),a.dispatchEvent(new sm("tokenChanged")),Jm(a,b[Dg]),an(a,"refreshToken",a.b.a));}function dn(a,b){return O(a.a,Ij,{idToken:b}).then(q(a.Kc,a))}
    k.Kc=function(a){a=a.users;if(!a||!a.length)throw new t("internal-error");a=a[0];Km(this,{uid:a.localId,displayName:a.displayName,photoURL:a.photoUrl,email:a.email,emailVerified:!!a.emailVerified,phoneNumber:a.phoneNumber,lastLoginAt:a.lastLoginAt,createdAt:a.createdAt,tenantId:a.tenantId});for(var b=en(a),c=0;c<b.length;c++)Zm(this,b[c]);an(this,"isAnonymous",!(this.email&&a.passwordHash)&&!(this.providerData&&this.providerData.length));this.dispatchEvent(new sm("userReloaded",{hd:a}));};
    function en(a){return (a=a.providerUserInfo)&&a.length?Ra(a,function(b){return new Hm(b.rawId,b.providerId,b.email,b.displayName,b.photoUrl,b.phoneNumber)}):[]}k.Lc=function(a){gf("firebase.User.prototype.reauthenticateAndRetrieveDataWithCredential is deprecated. Please use firebase.User.prototype.reauthenticateWithCredential instead.");return this.tb(a)};
    k.tb=function(a){var b=this,c=null;return R(this,a.c(this.a,this.uid).then(function(d){wm(b,d);c=fn(b,d,"reauthenticate");b.h=null;return b.reload()}).then(function(){return c}),!0)};function gn(a,b){return cn(a).then(function(){if(Va(Ym(a),b))return Um(a).then(function(){throw new t("provider-already-linked");})})}k.Cc=function(a){gf("firebase.User.prototype.linkAndRetrieveDataWithCredential is deprecated. Please use firebase.User.prototype.linkWithCredential instead.");return this.qb(a)};
    k.qb=function(a){var b=this,c=null;return R(this,gn(this,a.providerId).then(function(){return b.I()}).then(function(d){return a.b(b.a,d)}).then(function(d){c=fn(b,d,"link");return hn(b,d)}).then(function(){return c}))};k.Dc=function(a,b){var c=this;return R(this,gn(this,"phone").then(function(){return gm(Qm(c),a,b,q(c.qb,c))}))};k.Mc=function(a,b){var c=this;return R(this,E().then(function(){return gm(Qm(c),a,b,q(c.tb,c))}),!0)};
    function fn(a,b,c){var d=qh(b);b=og(b);return kf({user:a,credential:d,additionalUserInfo:b,operationType:c})}function hn(a,b){wm(a,b);return a.reload().then(function(){return a})}k.Bb=function(a){var b=this;return R(this,this.I().then(function(c){return b.a.Bb(c,a)}).then(function(c){wm(b,c);return b.reload()}))};k.ed=function(a){var b=this;return R(this,this.I().then(function(c){return a.b(b.a,c)}).then(function(c){wm(b,c);return b.reload()}))};
    k.Cb=function(a){var b=this;return R(this,this.I().then(function(c){return b.a.Cb(c,a)}).then(function(c){wm(b,c);return b.reload()}))};
    k.Db=function(a){if(void 0===a.displayName&&void 0===a.photoURL)return Xm(this);var b=this;return R(this,this.I().then(function(c){return b.a.Db(c,{displayName:a.displayName,photoUrl:a.photoURL})}).then(function(c){wm(b,c);an(b,"displayName",c.displayName||null);an(b,"photoURL",c.photoUrl||null);w(b.providerData,function(d){"password"===d.providerId&&(M(d,"displayName",b.displayName),M(d,"photoURL",b.photoURL));});return Um(b)}).then(Wm))};
    k.cd=function(a){var b=this;return R(this,cn(this).then(function(c){return Va(Ym(b),a)?rj(b.a,c,[a]).then(function(d){var e={};w(d.providerUserInfo||[],function(f){e[f.providerId]=!0;});w(Ym(b),function(f){e[f]||$m(b,f);});e[lh.PROVIDER_ID]||M(b,"phoneNumber",null);return Um(b)}):Um(b).then(function(){throw new t("no-such-provider");})}))};
    k.delete=function(){var a=this;return R(this,this.I().then(function(b){return O(a.a,Fj,{idToken:b})}).then(function(){a.dispatchEvent(new sm("userDeleted"));})).then(function(){for(var b=0;b<a.J.length;b++)a.J[b].cancel("app-deleted");Nm(a,null);Om(a,null);Pm(a,null);a.J=[];a.D=!0;Sm(a);M(a,"refreshToken",null);a.i&&Ql(a.i,a);})};
    k.Fb=function(a,b){return "linkViaPopup"==a&&(this.g||null)==b&&this.f||"reauthViaPopup"==a&&(this.g||null)==b&&this.f||"linkViaRedirect"==a&&(this.ga||null)==b||"reauthViaRedirect"==a&&(this.ga||null)==b?!0:!1};k.na=function(a,b,c,d){"linkViaPopup"!=a&&"reauthViaPopup"!=a||d!=(this.g||null)||(c&&this.C?this.C(c):b&&!c&&this.f&&this.f(b),this.c&&(this.c.cancel(),this.c=null),delete this.f,delete this.C);};
    k.Fa=function(a,b){return "linkViaPopup"==a&&b==(this.g||null)?q(this.Kb,this):"reauthViaPopup"==a&&b==(this.g||null)?q(this.Lb,this):"linkViaRedirect"==a&&(this.ga||null)==b?q(this.Kb,this):"reauthViaRedirect"==a&&(this.ga||null)==b?q(this.Lb,this):null};k.Ec=function(a){var b=this;return jn(this,"linkViaPopup",a,function(){return gn(b,a.providerId).then(function(){return Um(b)})},!1)};k.Nc=function(a){return jn(this,"reauthViaPopup",a,function(){return E()},!0)};
    function jn(a,b,c,d,e){if(!Re())return F(new t("operation-not-supported-in-this-environment"));if(a.h&&!e)return F(a.h);var f=ng(c.providerId),g=Qe(a.uid+":::"),h=null;(!Te()||Ie())&&a.s&&c.isOAuthProvider&&(h=ek(a.s,a.l,a.m,b,c,null,g,firebase$1.SDK_VERSION||null,null,null,a.tenantId));var m=ze(h,f&&f.ua,f&&f.ta);d=d().then(function(){kn(a);if(!e)return a.I().then(function(){})}).then(function(){return Tl(a.i,m,b,c,g,!!h,a.tenantId)}).then(function(){return new D(function(p,v){a.na(b,null,new t("cancelled-popup-request"),
    a.g||null);a.f=p;a.C=v;a.g=g;a.c=Vl(a.i,a,b,m,g);})}).then(function(p){m&&ye(m);return p?kf(p):null}).o(function(p){m&&ye(m);throw p;});return R(a,d,e)}k.Fc=function(a){var b=this;return ln(this,"linkViaRedirect",a,function(){return gn(b,a.providerId)},!1)};k.Oc=function(a){return ln(this,"reauthViaRedirect",a,function(){return E()},!0)};
    function ln(a,b,c,d,e){if(!Re())return F(new t("operation-not-supported-in-this-environment"));if(a.h&&!e)return F(a.h);var f=null,g=Qe(a.uid+":::");d=d().then(function(){kn(a);if(!e)return a.I().then(function(){})}).then(function(){a.ga=g;return Um(a)}).then(function(h){a.ha&&(h=a.ha,h=h.b.set(mn,a.w(),h.a));return h}).then(function(){return Ul(a.i,b,c,g,a.tenantId)}).o(function(h){f=h;if(a.ha)return nn(a.ha);throw f;}).then(function(){if(f)throw f;});return R(a,d,e)}
    function kn(a){if(!a.i||!a.R){if(a.i&&!a.R)throw new t("internal-error");throw new t("auth-domain-config-required");}}k.Kb=function(a,b,c,d){var e=this;this.c&&(this.c.cancel(),this.c=null);var f=null;c=this.I().then(function(g){return Hg(e.a,{requestUri:a,postBody:d,sessionId:b,idToken:g})}).then(function(g){f=fn(e,g,"link");return hn(e,g)}).then(function(){return f});return R(this,c)};
    k.Lb=function(a,b,c,d){var e=this;this.c&&(this.c.cancel(),this.c=null);var f=null,g=E().then(function(){return Cg(Ig(e.a,{requestUri:a,sessionId:b,postBody:d,tenantId:c}),e.uid)}).then(function(h){f=fn(e,h,"reauthenticate");wm(e,h);e.h=null;return e.reload()}).then(function(){return f});return R(this,g,!0)};
    k.ub=function(a){var b=this,c=null;return R(this,this.I().then(function(d){c=d;return "undefined"===typeof a||mb(a)?{}:bg(new Sf(a))}).then(function(d){return b.a.ub(c,d)}).then(function(d){if(b.email!=d)return b.reload()}).then(function(){}))};k.Eb=function(a,b){var c=this,d=null;return R(this,this.I().then(function(e){d=e;return "undefined"===typeof b||mb(b)?{}:bg(new Sf(b))}).then(function(e){return c.a.Eb(d,a,e)}).then(function(e){if(c.email!=e)return c.reload()}).then(function(){}))};
    function R(a,b,c){var d=on(a,b,c);a.J.push(d);d.oa(function(){Wa(a.J,d);});return d.o(function(e){var f=null;e&&"auth/multi-factor-auth-required"===e.code&&(f=mm(e.w(),Qm(a),q(a.jc,a)));throw f||e;})}k.jc=function(a){var b=null,c=this;a=Cg(E(a),c.uid).then(function(d){b=fn(c,d,"reauthenticate");wm(c,d);c.h=null;return c.reload()}).then(function(){return b});return R(this,a,!0)};
    function on(a,b,c){return a.h&&!c?(b.cancel(),F(a.h)):b.o(function(d){!d||"auth/user-disabled"!=d.code&&"auth/user-token-expired"!=d.code||(a.h||a.dispatchEvent(new sm("userInvalidated")),a.h=d);throw d;})}k.toJSON=function(){return this.w()};
    k.w=function(){var a={uid:this.uid,displayName:this.displayName,photoURL:this.photoURL,email:this.email,emailVerified:this.emailVerified,phoneNumber:this.phoneNumber,isAnonymous:this.isAnonymous,tenantId:this.tenantId,providerData:[],apiKey:this.l,appName:this.m,authDomain:this.s,stsTokenManager:this.b.w(),redirectEventId:this.ga||null};this.metadata&&z(a,this.metadata.w());w(this.providerData,function(b){a.providerData.push(lf(b));});z(a,this.O.w());return a};
    function pn(a){if(!a.apiKey)return null;var b={apiKey:a.apiKey,authDomain:a.authDomain,appName:a.appName,emulatorConfig:a.emulatorConfig},c={};if(a.stsTokenManager&&a.stsTokenManager.accessToken){c[Dg]=a.stsTokenManager.accessToken;c.refreshToken=a.stsTokenManager.refreshToken||null;var d=a.stsTokenManager.expirationTime;d&&(c.expiresIn=(d-Date.now())/1E3);}else return null;var e=new Im(b,c,a);a.providerData&&w(a.providerData,function(f){f&&Zm(e,kf(f));});a.redirectEventId&&(e.ga=a.redirectEventId);
    return e}function qn(a,b,c,d){var e=new Im(a,b);c&&(e.ha=c);d&&Mm(e,d);return e.reload().then(function(){return e})}function rn(a,b,c,d){var e=a.b,f={};f[Dg]=e.b&&e.b.toString();f.refreshToken=e.a;b=new Im(b||{apiKey:a.l,authDomain:a.s,appName:a.m},f);c&&(b.ha=c);d&&Mm(b,d);bn(b,a);return b}function sn(a){this.a=a;this.b=Vk();}var mn={name:"redirectUser",F:"session"};function nn(a){return Zk(a.b,mn,a.a)}function tn(a,b){return a.b.get(mn,a.a).then(function(c){c&&b&&(c.authDomain=b);return pn(c||{})})}function un(a){this.a=a;this.b=Vk();this.c=null;this.f=vn(this);this.b.addListener(wn("local"),this.a,q(this.g,this));}un.prototype.g=function(){var a=this,b=wn("local");xn(this,function(){return E().then(function(){return a.c&&"local"!=a.c.F?a.b.get(b,a.a):null}).then(function(c){if(c)return yn(a,"local").then(function(){a.c=b;})})});};function yn(a,b){var c=[],d;for(d in Rk)Rk[d]!==b&&c.push(Zk(a.b,wn(Rk[d]),a.a));c.push(Zk(a.b,zn,a.a));return Ic(c)}
    function vn(a){var b=wn("local"),c=wn("session"),d=wn("none");return Yk(a.b,b,a.a).then(function(){return a.b.get(c,a.a)}).then(function(e){return e?c:a.b.get(d,a.a).then(function(f){return f?d:a.b.get(b,a.a).then(function(g){return g?b:a.b.get(zn,a.a).then(function(h){return h?wn(h):b})})})}).then(function(e){a.c=e;return yn(a,e.F)}).o(function(){a.c||(a.c=b);})}var zn={name:"persistence",F:"session"};function wn(a){return {name:"authUser",F:a}}
    un.prototype.xb=function(a){var b=null,c=this;Sk(a);return xn(this,function(){return a!=c.c.F?c.b.get(c.c,c.a).then(function(d){b=d;return yn(c,a)}).then(function(){c.c=wn(a);if(b)return c.b.set(c.c,b,c.a)}):E()})};function An(a){return xn(a,function(){return a.b.set(zn,a.c.F,a.a)})}function Bn(a,b){return xn(a,function(){return a.b.set(a.c,b.w(),a.a)})}function Cn(a){return xn(a,function(){return Zk(a.b,a.c,a.a)})}
    function Dn(a,b,c){return xn(a,function(){return a.b.get(a.c,a.a).then(function(d){d&&b&&(d.authDomain=b);d&&c&&(d.emulatorConfig=c);return pn(d||{})})})}function xn(a,b){a.f=a.f.then(b,b);return a.f}function En(a){this.l=!1;M(this,"settings",new em);M(this,"app",a);if(S(this).options&&S(this).options.apiKey)a=firebase$1.SDK_VERSION?Oe(firebase$1.SDK_VERSION):null,this.a=new Ii(S(this).options&&S(this).options.apiKey,Ca(Da),a);else throw new t("invalid-api-key");this.R=[];this.s=[];this.O=[];this.hb=firebase$1.INTERNAL.createSubscribe(q(this.zc,this));this.X=void 0;this.bc=firebase$1.INTERNAL.createSubscribe(q(this.Ac,this));Fn(this,null);this.i=new un(S(this).options.apiKey+":"+S(this).name);this.D=
    new sn(S(this).options.apiKey+":"+S(this).name);this.$=T(this,Gn(this));this.h=T(this,Hn(this));this.ba=!1;this.ja=q(this.Zc,this);this.Ba=q(this.da,this);this.ya=q(this.mc,this);this.za=q(this.wc,this);this.Aa=q(this.xc,this);this.b=null;In(this);this.INTERNAL={};this.INTERNAL["delete"]=q(this.delete,this);this.INTERNAL.logFramework=q(this.Gc,this);this.u=0;H.call(this);Jn(this);this.J=[];this.P=null;}r(En,H);function Kn(a){G.call(this,"languageCodeChanged");this.h=a;}r(Kn,G);
    function Ln(a){G.call(this,"emulatorConfigChanged");this.c=a;}r(Ln,G);function Mn(a){G.call(this,"frameworkChanged");this.f=a;}r(Mn,G);k=En.prototype;k.xb=function(a){a=this.i.xb(a);return T(this,a)};k.wa=function(a){this.aa===a||this.l||(this.aa=a,Oi(this.a,this.aa),this.dispatchEvent(new Kn(this.la())));};k.la=function(){return this.aa};k.fd=function(){var a=l.navigator;this.wa(a?a.languages&&a.languages[0]||a.language||a.userLanguage||null:null);};
    k.gd=function(a,b){if(!this.P){if(!/^https?:\/\//.test(a))throw new t("argument-error","Emulator URL must start with a valid scheme (http:// or https://).");b=b?!!b.disableWarnings:!1;Nn(b);this.P={url:a,ec:b};this.settings.ib=!0;Pi(this.a,this.P);this.dispatchEvent(new Ln(this.P));}};
    function Nn(a){"undefined"!==typeof console&&"function"===typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");l.document&&!a&&Ee().then(function(){var b=l.document.createElement("div");b.innerText="Running in emulator mode. Do not use with production credentials.";b.style.position="fixed";b.style.width="100%";b.style.backgroundColor="#ffffff";b.style.border=".1em solid #000000";b.style.color=
    "#ff0000";b.style.bottom="0px";b.style.left="0px";b.style.margin="0px";b.style.zIndex=1E4;b.style.textAlign="center";b.classList.add("firebase-emulator-warning");l.document.body.appendChild(b);});}k.Gc=function(a){this.J.push(a);Ri(this.a,firebase$1.SDK_VERSION?Oe(firebase$1.SDK_VERSION,this.J):null);this.dispatchEvent(new Mn(this.J));};k.Ga=function(){return Za(this.J)};k.yb=function(a){this.S===a||this.l||(this.S=a,this.a.b=this.S);};k.T=function(){return this.S};
    function Jn(a){Object.defineProperty(a,"lc",{get:function(){return this.la()},set:function(b){this.wa(b);},enumerable:!1});a.aa=null;Object.defineProperty(a,"ti",{get:function(){return this.T()},set:function(b){this.yb(b);},enumerable:!1});a.S=null;Object.defineProperty(a,"emulatorConfig",{get:function(){if(this.P){var b=J(this.P.url);b=kf({protocol:b.c,host:b.a,port:b.g,options:kf({disableWarnings:this.P.ec})});}else b=null;return b},enumerable:!1});}
    k.toJSON=function(){return {apiKey:S(this).options.apiKey,authDomain:S(this).options.authDomain,appName:S(this).name,currentUser:U(this)&&U(this).w()}};function On(a){return a.Oa||F(new t("auth-domain-config-required"))}
    function In(a){var b=S(a).options.authDomain,c=S(a).options.apiKey;b&&Re()&&(a.Oa=a.$.then(function(){if(!a.l){a.b=Xl(b,c,S(a).name,a.P);Pl(a.b,a);U(a)&&Vm(U(a));if(a.m){Vm(a.m);var d=a.m;d.wa(a.la());Nm(d,a);d=a.m;Mm(d,a.J);Pm(d,a);d=a.m;Pi(d.a,a.P);Om(d,a);a.m=null;}return a.b}}));}k.Fb=function(a,b){switch(a){case "unknown":case "signInViaRedirect":return !0;case "signInViaPopup":return this.g==b&&!!this.f;default:return !1}};
    k.na=function(a,b,c,d){"signInViaPopup"==a&&this.g==d&&(c&&this.C?this.C(c):b&&!c&&this.f&&this.f(b),this.c&&(this.c.cancel(),this.c=null),delete this.f,delete this.C);};k.Fa=function(a,b){return "signInViaRedirect"==a||"signInViaPopup"==a&&this.g==b&&this.f?q(this.ic,this):null};k.ic=function(a,b,c,d){var e=this,f={requestUri:a,postBody:d,sessionId:b,tenantId:c};this.c&&(this.c.cancel(),this.c=null);return e.$.then(function(){return Pn(e,Fg(e.a,f))})};
    k.Xc=function(a){if(!Re())return F(new t("operation-not-supported-in-this-environment"));var b=this,c=ng(a.providerId),d=Qe(),e=null;(!Te()||Ie())&&S(this).options.authDomain&&a.isOAuthProvider&&(e=ek(S(this).options.authDomain,S(this).options.apiKey,S(this).name,"signInViaPopup",a,null,d,firebase$1.SDK_VERSION||null,null,null,this.T(),this.P));var f=ze(e,c&&c.ua,c&&c.ta);c=On(this).then(function(g){return Tl(g,f,"signInViaPopup",a,d,!!e,b.T())}).then(function(){return new D(function(g,h){b.na("signInViaPopup",
    null,new t("cancelled-popup-request"),b.g);b.f=g;b.C=h;b.g=d;b.c=Vl(b.b,b,"signInViaPopup",f,d);})}).then(function(g){f&&ye(f);return g?kf(g):null}).o(function(g){f&&ye(f);throw g;});return T(this,c)};k.Yc=function(a){if(!Re())return F(new t("operation-not-supported-in-this-environment"));var b=this,c=On(this).then(function(){return An(b.i)}).then(function(){return Ul(b.b,"signInViaRedirect",a,void 0,b.T())});return T(this,c)};
    function Qn(a){if(!Re())return F(new t("operation-not-supported-in-this-environment"));var b=On(a).then(function(){return a.b.qa()}).then(function(c){return c?kf(c):null});return T(a,b)}k.qa=function(){var a=this;return Qn(this).then(function(b){a.b&&$l(a.b.b);return b}).o(function(b){a.b&&$l(a.b.b);throw b;})};
    k.dd=function(a){if(!a)return F(new t("null-user"));if(this.S!=a.tenantId)return F(new t("tenant-id-mismatch"));var b=this,c={};c.apiKey=S(this).options.apiKey;c.authDomain=S(this).options.authDomain;c.appName=S(this).name;var d=rn(a,c,b.D,b.Ga());return T(this,this.h.then(function(){if(S(b).options.apiKey!=a.l)return d.reload()}).then(function(){if(U(b)&&a.uid==U(b).uid)return bn(U(b),a),b.da(a);Fn(b,d);Vm(d);return b.da(d)}).then(function(){Rn(b);}))};
    function Sn(a,b){var c={};c.apiKey=S(a).options.apiKey;c.authDomain=S(a).options.authDomain;c.appName=S(a).name;a.P&&(c.emulatorConfig=a.P);return a.$.then(function(){return qn(c,b,a.D,a.Ga())}).then(function(d){if(U(a)&&d.uid==U(a).uid)return bn(U(a),d),a.da(d);Fn(a,d);Vm(d);return a.da(d)}).then(function(){Rn(a);})}
    function Fn(a,b){U(a)&&(Tm(U(a),a.Ba),xd(U(a),"tokenChanged",a.ya),xd(U(a),"userDeleted",a.za),xd(U(a),"userInvalidated",a.Aa),Sm(U(a)));b&&(b.S.push(a.Ba),nd(b,"tokenChanged",a.ya),nd(b,"userDeleted",a.za),nd(b,"userInvalidated",a.Aa),0<a.u&&Rm(b));M(a,"currentUser",b);b&&(b.wa(a.la()),Nm(b,a),Mm(b,a.J),Pm(b,a),Pi(b.a,a.P),Om(b,a));}k.Ab=function(){var a=this,b=this.h.then(function(){a.b&&$l(a.b.b);if(!U(a))return E();Fn(a,null);return Cn(a.i).then(function(){Rn(a);})});return T(this,b)};
    function Tn(a){var b=tn(a.D,S(a).options.authDomain).then(function(c){if(a.m=c)c.ha=a.D;return nn(a.D)});return T(a,b)}function Gn(a){var b=S(a).options.authDomain,c=Tn(a).then(function(){return Dn(a.i,b,a.P)}).then(function(d){return d?(d.ha=a.D,a.m&&(a.m.ga||null)==(d.ga||null)?d:d.reload().then(function(){return Bn(a.i,d).then(function(){return d})}).o(function(e){return "auth/network-request-failed"==e.code?d:Cn(a.i)})):null}).then(function(d){Fn(a,d||null);});return T(a,c)}
    function Hn(a){return a.$.then(function(){return Qn(a)}).o(function(){}).then(function(){if(!a.l)return a.ja()}).o(function(){}).then(function(){if(!a.l){a.ba=!0;var b=a.i;b.b.addListener(wn("local"),b.a,a.ja);}})}
    k.Zc=function(){var a=this;return Dn(this.i,S(this).options.authDomain).then(function(b){if(!a.l){var c;if(c=U(a)&&b){c=U(a).uid;var d=b.uid;c=void 0===c||null===c||""===c||void 0===d||null===d||""===d?!1:c==d;}if(c)return bn(U(a),b),U(a).I();if(U(a)||b)Fn(a,b),b&&(Vm(b),b.ha=a.D),a.b&&Pl(a.b,a),Rn(a);}})};k.da=function(a){return Bn(this.i,a)};k.mc=function(){Rn(this);this.da(U(this));};k.wc=function(){this.Ab();};k.xc=function(){this.Ab();};
    function Pn(a,b){var c=null,d=null;return T(a,b.then(function(e){c=qh(e);d=og(e);return Sn(a,e)},function(e){var f=null;e&&"auth/multi-factor-auth-required"===e.code&&(f=mm(e.w(),a,q(a.kc,a)));throw f||e;}).then(function(){return kf({user:U(a),credential:c,additionalUserInfo:d,operationType:"signIn"})}))}k.kc=function(a){var b=this;return this.h.then(function(){return Pn(b,E(a))})};k.zc=function(a){var b=this;this.addAuthTokenListener(function(){a.next(U(b));});};
    k.Ac=function(a){var b=this;Un(this,function(){a.next(U(b));});};k.Ic=function(a,b,c){var d=this;this.ba&&Promise.resolve().then(function(){"function"===typeof a?a(U(d)):"function"===typeof a.next&&a.next(U(d));});return this.hb(a,b,c)};k.Hc=function(a,b,c){var d=this;this.ba&&Promise.resolve().then(function(){d.X=d.getUid();"function"===typeof a?a(U(d)):"function"===typeof a.next&&a.next(U(d));});return this.bc(a,b,c)};
    k.nc=function(a){var b=this,c=this.h.then(function(){return U(b)?U(b).I(a).then(function(d){return {accessToken:d}}):null});return T(this,c)};k.Tc=function(a){var b=this;return this.h.then(function(){return Pn(b,O(b.a,Kj,{token:a}))}).then(function(c){var d=c.user;an(d,"isAnonymous",!1);b.da(d);return c})};k.Uc=function(a,b){var c=this;return this.h.then(function(){return Pn(c,O(c.a,ah,{email:a,password:b}))})};
    k.dc=function(a,b){var c=this;return this.h.then(function(){return Pn(c,O(c.a,Ej,{email:a,password:b}))})};k.$a=function(a){var b=this;return this.h.then(function(){return Pn(b,a.ka(b.a))})};k.Sc=function(a){gf("firebase.auth.Auth.prototype.signInAndRetrieveDataWithCredential is deprecated. Please use firebase.auth.Auth.prototype.signInWithCredential instead.");return this.$a(a)};
    k.zb=function(){var a=this;return this.h.then(function(){var b=U(a);if(b&&b.isAnonymous){var c=kf({providerId:null,isNewUser:!1});return kf({user:b,credential:null,additionalUserInfo:c,operationType:"signIn"})}return Pn(a,a.a.zb()).then(function(d){var e=d.user;an(e,"isAnonymous",!0);a.da(e);return d})})};function S(a){return a.app}function U(a){return a.currentUser}k.getUid=function(){return U(this)&&U(this).uid||null};function Vn(a){return U(a)&&U(a)._lat||null}
    function Rn(a){if(a.ba){for(var b=0;b<a.s.length;b++)if(a.s[b])a.s[b](Vn(a));if(a.X!==a.getUid()&&a.O.length)for(a.X=a.getUid(),b=0;b<a.O.length;b++)if(a.O[b])a.O[b](Vn(a));}}k.cc=function(a){this.addAuthTokenListener(a);this.u++;0<this.u&&U(this)&&Rm(U(this));};k.Pc=function(a){var b=this;w(this.s,function(c){c==a&&b.u--;});0>this.u&&(this.u=0);0==this.u&&U(this)&&Sm(U(this));this.removeAuthTokenListener(a);};
    k.addAuthTokenListener=function(a){var b=this;this.s.push(a);T(this,this.h.then(function(){b.l||Va(b.s,a)&&a(Vn(b));}));};k.removeAuthTokenListener=function(a){Xa(this.s,function(b){return b==a});};function Un(a,b){a.O.push(b);T(a,a.h.then(function(){!a.l&&Va(a.O,b)&&a.X!==a.getUid()&&(a.X=a.getUid(),b(Vn(a)));}));}
    k.delete=function(){this.l=!0;for(var a=0;a<this.R.length;a++)this.R[a].cancel("app-deleted");this.R=[];this.i&&(a=this.i,a.b.removeListener(wn("local"),a.a,this.ja));this.b&&(Ql(this.b,this),$l(this.b.b));return Promise.resolve()};function T(a,b){a.R.push(b);b.oa(function(){Wa(a.R,b);});return b}k.hc=function(a){return T(this,aj(this.a,a))};k.Bc=function(a){return !!fh(a)};
    k.wb=function(a,b){var c=this;return T(this,E().then(function(){var d=new Sf(b);if(!d.c)throw new t("argument-error",$f+" must be true when sending sign in link to email");return bg(d)}).then(function(d){return c.a.wb(a,d)}).then(function(){}))};k.jd=function(a){return this.Ra(a).then(function(b){return b.data.email})};k.nb=function(a,b){return T(this,this.a.nb(a,b).then(function(){}))};k.Ra=function(a){return T(this,this.a.Ra(a).then(function(b){return new vf(b)}))};
    k.jb=function(a){return T(this,this.a.jb(a).then(function(){}))};k.vb=function(a,b){var c=this;return T(this,E().then(function(){return "undefined"===typeof b||mb(b)?{}:bg(new Sf(b))}).then(function(d){return c.a.vb(a,d)}).then(function(){}))};k.Wc=function(a,b){return T(this,gm(this,a,b,q(this.$a,this)))};
    k.Vc=function(a,b){var c=this;return T(this,E().then(function(){var d=b||re(),e=eh(a,d);d=fh(d);if(!d)throw new t("argument-error","Invalid email link!");if(d.tenantId!==c.T())throw new t("tenant-id-mismatch");return c.$a(e)}))};function Wn(){}Wn.prototype.render=function(){};Wn.prototype.reset=function(){};Wn.prototype.getResponse=function(){};Wn.prototype.execute=function(){};function Xn(){this.a={};this.b=1E12;}var Yn=null;Xn.prototype.render=function(a,b){this.a[this.b.toString()]=new Zn(a,b);return this.b++};Xn.prototype.reset=function(a){var b=$n(this,a);a=ao(a);b&&a&&(b.delete(),delete this.a[a]);};Xn.prototype.getResponse=function(a){return (a=$n(this,a))?a.getResponse():null};Xn.prototype.execute=function(a){(a=$n(this,a))&&a.execute();};function $n(a,b){return (b=ao(b))?a.a[b]||null:null}function ao(a){return (a="undefined"===typeof a?1E12:a)?a.toString():null}
    function Zn(a,b){this.g=!1;this.c=b;this.a=this.b=null;this.h="invisible"!==this.c.size;this.f=kc(a);var c=this;this.i=function(){c.execute();};this.h?this.execute():nd(this.f,"click",this.i);}Zn.prototype.getResponse=function(){bo(this);return this.b};
    Zn.prototype.execute=function(){bo(this);var a=this;this.a||(this.a=setTimeout(function(){a.b=Me();var b=a.c.callback,c=a.c["expired-callback"];if(b)try{b(a.b);}catch(d){}a.a=setTimeout(function(){a.a=null;a.b=null;if(c)try{c();}catch(d){}a.h&&a.execute();},6E4);},500));};Zn.prototype.delete=function(){bo(this);this.g=!0;clearTimeout(this.a);this.a=null;xd(this.f,"click",this.i);};function bo(a){if(a.g)throw Error("reCAPTCHA mock was already deleted!");}function co(){}M(co,"FACTOR_ID","phone");function eo(){}eo.prototype.g=function(){Yn||(Yn=new Xn);return E(Yn)};eo.prototype.c=function(){};var fo=null;function go(){this.b=l.grecaptcha?Infinity:0;this.f=null;this.a="__rcb"+Math.floor(1E6*Math.random()).toString();}var ho=new qb(rb,"https://www.google.com/recaptcha/api.js?onload=%{onload}&render=explicit&hl=%{hl}"),io=new Ze(3E4,6E4);
    go.prototype.g=function(a){var b=this;return new D(function(c,d){var e=setTimeout(function(){d(new t("network-request-failed"));},io.get());if(!l.grecaptcha||a!==b.f&&!b.b){l[b.a]=function(){if(l.grecaptcha){b.f=a;var g=l.grecaptcha.render;l.grecaptcha.render=function(h,m){h=g(h,m);b.b++;return h};clearTimeout(e);c(l.grecaptcha);}else clearTimeout(e),d(new t("internal-error"));delete l[b.a];};var f=zb(ho,{onload:b.a,hl:a||""});E(Bi(f)).o(function(){clearTimeout(e);d(new t("internal-error","Unable to load external reCAPTCHA dependencies!"));});}else clearTimeout(e),
    c(l.grecaptcha);})};go.prototype.c=function(){this.b--;};var jo=null;function ko(a,b,c,d,e,f,g){M(this,"type","recaptcha");this.c=this.f=null;this.D=!1;this.v=b;this.g=null;g?(fo||(fo=new eo),g=fo):(jo||(jo=new go),g=jo);this.m=g;this.a=c||{theme:"light",type:"image"};this.h=[];if(this.a[lo])throw new t("argument-error","sitekey should not be provided for reCAPTCHA as one is automatically provisioned for the current project.");this.i="invisible"===this.a[mo];if(!l.document)throw new t("operation-not-supported-in-this-environment","RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment with DOM support.");
    if(!kc(b)||!this.i&&kc(b).hasChildNodes())throw new t("argument-error","reCAPTCHA container is either not found or already contains inner elements!");this.s=new Ii(a,f||null,e||null);this.u=d||function(){return null};var h=this;this.l=[];var m=this.a[no];this.a[no]=function(v){oo(h,v);if("function"===typeof m)m(v);else if("string"===typeof m){var B=L(m,l);"function"===typeof B&&B(v);}};var p=this.a[po];this.a[po]=function(){oo(h,null);if("function"===typeof p)p();else if("string"===typeof p){var v=
    L(p,l);"function"===typeof v&&v();}};}var no="callback",po="expired-callback",lo="sitekey",mo="size";function oo(a,b){for(var c=0;c<a.l.length;c++)try{a.l[c](b);}catch(d){}}function qo(a,b){Xa(a.l,function(c){return c==b});}function ro(a,b){a.h.push(b);b.oa(function(){Wa(a.h,b);});return b}k=ko.prototype;
    k.Ia=function(){var a=this;return this.f?this.f:this.f=ro(this,E().then(function(){if(Se()&&!Je())return Ee();throw new t("operation-not-supported-in-this-environment","RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment.");}).then(function(){return a.m.g(a.u())}).then(function(b){a.g=b;return O(a.s,Jj,{})}).then(function(b){a.a[lo]=b.recaptchaSiteKey;}).o(function(b){a.f=null;throw b;}))};
    k.render=function(){so(this);var a=this;return ro(this,this.Ia().then(function(){if(null===a.c){var b=a.v;if(!a.i){var c=kc(b);b=nc("DIV");c.appendChild(b);}a.c=a.g.render(b,a.a);}return a.c}))};k.verify=function(){so(this);var a=this;return ro(this,this.render().then(function(b){return new D(function(c){var d=a.g.getResponse(b);if(d)c(d);else {var e=function(f){f&&(qo(a,e),c(f));};a.l.push(e);a.i&&a.g.execute(a.c);}})}))};k.reset=function(){so(this);null!==this.c&&this.g.reset(this.c);};
    function so(a){if(a.D)throw new t("internal-error","RecaptchaVerifier instance has been destroyed.");}k.clear=function(){so(this);this.D=!0;this.m.c();for(var a=0;a<this.h.length;a++)this.h[a].cancel("RecaptchaVerifier instance has been destroyed.");if(!this.i){a=kc(this.v);for(var b;b=a.firstChild;)a.removeChild(b);}};
    function to(a,b,c){var d=!1;try{this.b=c||firebase$1.app();}catch(g){throw new t("argument-error","No firebase.app.App instance is currently initialized.");}if(this.b.options&&this.b.options.apiKey)c=this.b.options.apiKey;else throw new t("invalid-api-key");var e=this,f=null;try{f=this.b.auth().Ga();}catch(g){}try{d=this.b.auth().settings.appVerificationDisabledForTesting;}catch(g){}f=firebase$1.SDK_VERSION?Oe(firebase$1.SDK_VERSION,f):null;ko.call(this,c,a,b,function(){try{var g=e.b.auth().la();}catch(h){g=
    null;}return g},f,Ca(Da),d);}r(to,ko);function uo(a,b,c,d){a:{c=Array.prototype.slice.call(c);var e=0;for(var f=!1,g=0;g<b.length;g++)if(b[g].optional)f=!0;else {if(f)throw new t("internal-error","Argument validator encountered a required argument after an optional argument.");e++;}f=b.length;if(c.length<e||f<c.length)d="Expected "+(e==f?1==e?"1 argument":e+" arguments":e+"-"+f+" arguments")+" but got "+c.length+".";else {for(e=0;e<c.length;e++)if(f=b[e].optional&&void 0===c[e],!b[e].M(c[e])&&!f){b=b[e];if(0>e||e>=vo.length)throw new t("internal-error",
    "Argument validator received an unsupported number of arguments.");c=vo[e];d=(d?"":c+" argument ")+(b.name?'"'+b.name+'" ':"")+"must be "+b.K+".";break a}d=null;}}if(d)throw new t("argument-error",a+" failed: "+d);}var vo="First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" ");function V(a,b){return {name:a||"",K:"a valid string",optional:!!b,M:function(c){return "string"===typeof c}}}
    function wo(a,b){return {name:a||"",K:"a boolean",optional:!!b,M:function(c){return "boolean"===typeof c}}}function W(a,b){return {name:a||"",K:"a valid object",optional:!!b,M:n}}function xo(a,b){return {name:a||"",K:"a function",optional:!!b,M:function(c){return "function"===typeof c}}}function yo(a,b){return {name:a||"",K:"null",optional:!!b,M:function(c){return null===c}}}function zo(){return {name:"",K:"an HTML element",optional:!1,M:function(a){return !!(a&&a instanceof Element)}}}
    function Ao(){return {name:"auth",K:"an instance of Firebase Auth",optional:!0,M:function(a){return !!(a&&a instanceof En)}}}function Bo(){return {name:"app",K:"an instance of Firebase App",optional:!0,M:function(a){return !!(a&&a instanceof firebase$1.app.App)}}}function Co(a){return {name:a?a+"Credential":"credential",K:a?"a valid "+a+" credential":"a valid credential",optional:!1,M:function(b){if(!b)return !1;var c=!a||b.providerId===a;return !(!b.ka||!c)}}}
    function Do(){return {name:"multiFactorAssertion",K:"a valid multiFactorAssertion",optional:!1,M:function(a){return a?!!a.sb:!1}}}function Eo(){return {name:"authProvider",K:"a valid Auth provider",optional:!1,M:function(a){return !!(a&&a.providerId&&a.hasOwnProperty&&a.hasOwnProperty("isOAuthProvider"))}}}function Fo(a,b){return n(a)&&"string"===typeof a.type&&a.type===b&&"function"===typeof a.Ha}function Go(a){return n(a)&&"string"===typeof a.uid}
    function Ho(){return {name:"applicationVerifier",K:"an implementation of firebase.auth.ApplicationVerifier",optional:!1,M:function(a){return !(!a||"string"!==typeof a.type||"function"!==typeof a.verify)}}}function X(a,b,c,d){return {name:c||"",K:a.K+" or "+b.K,optional:!!d,M:function(e){return a.M(e)||b.M(e)}}}function Y(a,b){for(var c in b){var d=b[c].name;a[d]=Io(d,a[c],b[c].j);}}function Jo(a,b){for(var c in b){var d=b[c].name;d!==c&&Object.defineProperty(a,d,{get:ua(function(e){return this[e]},c),set:ua(function(e,f,g,h){uo(e,[g],[h],!0);this[f]=h;},d,c,b[c].kb),enumerable:!0});}}function Z(a,b,c,d){a[b]=Io(b,c,d);}
    function Io(a,b,c){function d(){var g=Array.prototype.slice.call(arguments);uo(e,c,g);return b.apply(this,g)}if(!c)return b;var e=Ko(a),f;for(f in b)d[f]=b[f];for(f in b.prototype)d.prototype[f]=b.prototype[f];return d}function Ko(a){a=a.split(".");return a[a.length-1]}Y(En.prototype,{jb:{name:"applyActionCode",j:[V("code")]},Ra:{name:"checkActionCode",j:[V("code")]},nb:{name:"confirmPasswordReset",j:[V("code"),V("newPassword")]},dc:{name:"createUserWithEmailAndPassword",j:[V("email"),V("password")]},hc:{name:"fetchSignInMethodsForEmail",j:[V("email")]},qa:{name:"getRedirectResult",j:[]},Bc:{name:"isSignInWithEmailLink",j:[V("emailLink")]},Hc:{name:"onAuthStateChanged",j:[X(W(),xo(),"nextOrObserver"),xo("opt_error",!0),xo("opt_completed",!0)]},Ic:{name:"onIdTokenChanged",
    j:[X(W(),xo(),"nextOrObserver"),xo("opt_error",!0),xo("opt_completed",!0)]},vb:{name:"sendPasswordResetEmail",j:[V("email"),X(W("opt_actionCodeSettings",!0),yo(null,!0),"opt_actionCodeSettings",!0)]},wb:{name:"sendSignInLinkToEmail",j:[V("email"),W("actionCodeSettings")]},xb:{name:"setPersistence",j:[V("persistence")]},Sc:{name:"signInAndRetrieveDataWithCredential",j:[Co()]},zb:{name:"signInAnonymously",j:[]},$a:{name:"signInWithCredential",j:[Co()]},Tc:{name:"signInWithCustomToken",j:[V("token")]},
    Uc:{name:"signInWithEmailAndPassword",j:[V("email"),V("password")]},Vc:{name:"signInWithEmailLink",j:[V("email"),V("emailLink",!0)]},Wc:{name:"signInWithPhoneNumber",j:[V("phoneNumber"),Ho()]},Xc:{name:"signInWithPopup",j:[Eo()]},Yc:{name:"signInWithRedirect",j:[Eo()]},dd:{name:"updateCurrentUser",j:[X(function(a){return {name:"user",K:"an instance of Firebase User",optional:!!a,M:function(b){return !!(b&&b instanceof Im)}}}(),yo(),"user")]},Ab:{name:"signOut",j:[]},toJSON:{name:"toJSON",j:[V(null,
    !0)]},fd:{name:"useDeviceLanguage",j:[]},gd:{name:"useEmulator",j:[V("url"),W("options",!0)]},jd:{name:"verifyPasswordResetCode",j:[V("code")]}});Jo(En.prototype,{lc:{name:"languageCode",kb:X(V(),yo(),"languageCode")},ti:{name:"tenantId",kb:X(V(),yo(),"tenantId")}});En.Persistence=Rk;En.Persistence.LOCAL="local";En.Persistence.SESSION="session";En.Persistence.NONE="none";
    Y(Im.prototype,{"delete":{name:"delete",j:[]},oc:{name:"getIdTokenResult",j:[wo("opt_forceRefresh",!0)]},I:{name:"getIdToken",j:[wo("opt_forceRefresh",!0)]},Cc:{name:"linkAndRetrieveDataWithCredential",j:[Co()]},qb:{name:"linkWithCredential",j:[Co()]},Dc:{name:"linkWithPhoneNumber",j:[V("phoneNumber"),Ho()]},Ec:{name:"linkWithPopup",j:[Eo()]},Fc:{name:"linkWithRedirect",j:[Eo()]},Lc:{name:"reauthenticateAndRetrieveDataWithCredential",j:[Co()]},tb:{name:"reauthenticateWithCredential",j:[Co()]},Mc:{name:"reauthenticateWithPhoneNumber",
    j:[V("phoneNumber"),Ho()]},Nc:{name:"reauthenticateWithPopup",j:[Eo()]},Oc:{name:"reauthenticateWithRedirect",j:[Eo()]},reload:{name:"reload",j:[]},ub:{name:"sendEmailVerification",j:[X(W("opt_actionCodeSettings",!0),yo(null,!0),"opt_actionCodeSettings",!0)]},toJSON:{name:"toJSON",j:[V(null,!0)]},cd:{name:"unlink",j:[V("provider")]},Bb:{name:"updateEmail",j:[V("email")]},Cb:{name:"updatePassword",j:[V("password")]},ed:{name:"updatePhoneNumber",j:[Co("phone")]},Db:{name:"updateProfile",j:[W("profile")]},
    Eb:{name:"verifyBeforeUpdateEmail",j:[V("email"),X(W("opt_actionCodeSettings",!0),yo(null,!0),"opt_actionCodeSettings",!0)]}});Y(Xn.prototype,{execute:{name:"execute"},render:{name:"render"},reset:{name:"reset"},getResponse:{name:"getResponse"}});Y(Wn.prototype,{execute:{name:"execute"},render:{name:"render"},reset:{name:"reset"},getResponse:{name:"getResponse"}});Y(D.prototype,{oa:{name:"finally"},o:{name:"catch"},then:{name:"then"}});
    Jo(em.prototype,{appVerificationDisabled:{name:"appVerificationDisabledForTesting",kb:wo("appVerificationDisabledForTesting")}});Y(fm.prototype,{confirm:{name:"confirm",j:[V("verificationCode")]}});Z(Bg,"fromJSON",function(a){a="string"===typeof a?JSON.parse(a):a;for(var b,c=[Mg,dh,kh,Jg],d=0;d<c.length;d++)if(b=c[d](a))return b;return null},[X(V(),W(),"json")]);Z(Zg,"credential",function(a,b){return new Yg(a,b)},[V("email"),V("password")]);Y(Yg.prototype,{w:{name:"toJSON",j:[V(null,!0)]}});
    Y(Qg.prototype,{Ca:{name:"addScope",j:[V("scope")]},Ka:{name:"setCustomParameters",j:[W("customOAuthParameters")]}});Z(Qg,"credential",Rg,[X(V(),W(),"token")]);Z(Zg,"credentialWithLink",eh,[V("email"),V("emailLink")]);Y(Sg.prototype,{Ca:{name:"addScope",j:[V("scope")]},Ka:{name:"setCustomParameters",j:[W("customOAuthParameters")]}});Z(Sg,"credential",Tg,[X(V(),W(),"token")]);Y(Ug.prototype,{Ca:{name:"addScope",j:[V("scope")]},Ka:{name:"setCustomParameters",j:[W("customOAuthParameters")]}});
    Z(Ug,"credential",Vg,[X(V(),X(W(),yo()),"idToken"),X(V(),yo(),"accessToken",!0)]);Y(Wg.prototype,{Ka:{name:"setCustomParameters",j:[W("customOAuthParameters")]}});Z(Wg,"credential",Xg,[X(V(),W(),"token"),V("secret",!0)]);Y(Pg.prototype,{Ca:{name:"addScope",j:[V("scope")]},credential:{name:"credential",j:[X(V(),X(W(),yo()),"optionsOrIdToken"),X(V(),yo(),"accessToken",!0)]},Ka:{name:"setCustomParameters",j:[W("customOAuthParameters")]}});Y(Kg.prototype,{w:{name:"toJSON",j:[V(null,!0)]}});
    Y(Eg.prototype,{w:{name:"toJSON",j:[V(null,!0)]}});Z(lh,"credential",ph,[V("verificationId"),V("verificationCode")]);
    Y(lh.prototype,{fb:{name:"verifyPhoneNumber",j:[X(V(),function(a,b){return {name:a||"phoneInfoOptions",K:"valid phone info options",optional:!!b,M:function(c){return c?c.session&&c.phoneNumber?Fo(c.session,zg)&&"string"===typeof c.phoneNumber:c.session&&c.multiFactorHint?Fo(c.session,Ag)&&Go(c.multiFactorHint):c.session&&c.multiFactorUid?Fo(c.session,Ag)&&"string"===typeof c.multiFactorUid:c.phoneNumber?"string"===typeof c.phoneNumber:!1:!1}}}(),"phoneInfoOptions"),Ho()]}});
    Y(gh.prototype,{w:{name:"toJSON",j:[V(null,!0)]}});Y(t.prototype,{toJSON:{name:"toJSON",j:[V(null,!0)]}});Y(yh.prototype,{toJSON:{name:"toJSON",j:[V(null,!0)]}});Y(xh.prototype,{toJSON:{name:"toJSON",j:[V(null,!0)]}});Y(lm.prototype,{toJSON:{name:"toJSON",j:[V(null,!0)]}});Y(im.prototype,{Rc:{name:"resolveSignIn",j:[Do()]}});
    Y(tm.prototype,{Rb:{name:"getSession",j:[]},fc:{name:"enroll",j:[Do(),V("displayName",!0)]},bd:{name:"unenroll",j:[X({name:"multiFactorInfo",K:"a valid multiFactorInfo",optional:!1,M:Go},V(),"multiFactorInfoIdentifier")]}});Y(to.prototype,{clear:{name:"clear",j:[]},render:{name:"render",j:[]},verify:{name:"verify",j:[]}});Z(Jf,"parseLink",Rf,[V("link")]);Z(co,"assertion",function(a){return new rm(a)},[Co("phone")]);
    (function(){if("undefined"!==typeof firebase$1&&firebase$1.INTERNAL&&firebase$1.INTERNAL.registerComponent){var a={ActionCodeInfo:{Operation:{EMAIL_SIGNIN:Af,PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:Cf,VERIFY_AND_CHANGE_EMAIL:Bf,VERIFY_EMAIL:"VERIFY_EMAIL"}},Auth:En,AuthCredential:Bg,Error:t};Z(a,"EmailAuthProvider",Zg,[]);Z(a,"FacebookAuthProvider",Qg,[]);Z(a,"GithubAuthProvider",Sg,[]);Z(a,"GoogleAuthProvider",Ug,[]);Z(a,"TwitterAuthProvider",Wg,[]);
    Z(a,"OAuthProvider",Pg,[V("providerId")]);Z(a,"SAMLAuthProvider",Og,[V("providerId")]);Z(a,"PhoneAuthProvider",lh,[Ao()]);Z(a,"RecaptchaVerifier",to,[X(V(),zo(),"recaptchaContainer"),W("recaptchaParameters",!0),Bo()]);Z(a,"ActionCodeURL",Jf,[]);Z(a,"PhoneMultiFactorGenerator",co,[]);firebase$1.INTERNAL.registerComponent({name:"auth",instanceFactory:function(b){b=b.getProvider("app").getImmediate();return new En(b)},multipleInstances:!1,serviceProps:a,instantiationMode:"LAZY",type:"PUBLIC"});firebase$1.INTERNAL.registerComponent({name:"auth-internal",
    instanceFactory:function(b){b=b.getProvider("auth").getImmediate();return {getUid:q(b.getUid,b),getToken:q(b.nc,b),addAuthTokenListener:q(b.cc,b),removeAuthTokenListener:q(b.Pc,b)}},multipleInstances:!1,instantiationMode:"LAZY",type:"PRIVATE"});firebase$1.registerVersion("@firebase/auth","0.16.4");firebase$1.INTERNAL.extendNamespace({User:Im});}else throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");})();}).apply(typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

    /* src/Auth.svelte generated by Svelte v3.35.0 */
    const file$g = "src/Auth.svelte";

    const get_default_slot_changes$2 = dirty => ({
    	user: dirty & /*user*/ 8,
    	loggedIn: dirty & /*loggedIn*/ 16
    });

    const get_default_slot_context$2 = ctx => ({
    	user: /*user*/ ctx[3],
    	loggedIn: /*loggedIn*/ ctx[4],
    	loginWithGoogle: /*loginWithGoogle*/ ctx[1],
    	loginWithEmailPassword: /*loginWithEmailPassword*/ ctx[0],
    	logout: /*logout*/ ctx[2]
    });

    function create_fragment$h(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$g, 57, 2, 1636);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, user, loggedIn*/ 88) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_default_slot_changes$2, get_default_slot_context$2);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let loggedIn;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Auth", slots, ['default']);
    	const auth = firebase$1.auth();

    	// Firebase user
    	let user = null;

    	let { useRedirect = false } = $$props;

    	// small mapper function
    	const userMapper = claims => ({
    		id: claims.user_id,
    		name: claims.name,
    		email: claims.email,
    		picture: claims.picture
    	});

    	const loginWithEmailPassword = (email, password) => auth.signInWithEmailAndPassword(email, password);

    	const loginWithGoogle = () => {
    		const provider = new firebase$1.auth.GoogleAuthProvider();

    		if (useRedirect) {
    			return auth.signInWithRedirect(provider);
    		} else {
    			return auth.signInWithPopup(provider);
    		}
    	};

    	const logout = () => auth.signOut();

    	// will be fired every time auth state changes
    	auth.onAuthStateChanged(async fireUser => {
    		if (fireUser) {
    			// in here you might want to do some further actions
    			// such as loading more data, etc.
    			// if you want to set custom claims such as roles on a user
    			// this is how to get them because they will be present
    			// on the token.claims object
    			const token = await fireUser.getIdTokenResult();

    			$$invalidate(3, user = userMapper(token.claims));
    		} else {
    			$$invalidate(3, user = null);
    		}
    	});

    	const writable_props = ["useRedirect"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Auth> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("useRedirect" in $$props) $$invalidate(5, useRedirect = $$props.useRedirect);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		firebase: firebase$1,
    		auth,
    		user,
    		useRedirect,
    		userMapper,
    		loginWithEmailPassword,
    		loginWithGoogle,
    		logout,
    		loggedIn
    	});

    	$$self.$inject_state = $$props => {
    		if ("user" in $$props) $$invalidate(3, user = $$props.user);
    		if ("useRedirect" in $$props) $$invalidate(5, useRedirect = $$props.useRedirect);
    		if ("loggedIn" in $$props) $$invalidate(4, loggedIn = $$props.loggedIn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*user*/ 8) {
    			// reactive helper variable
    			$$invalidate(4, loggedIn = user !== null);
    		}
    	};

    	return [
    		loginWithEmailPassword,
    		loginWithGoogle,
    		logout,
    		user,
    		loggedIn,
    		useRedirect,
    		$$scope,
    		slots
    	];
    }

    class Auth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			useRedirect: 5,
    			loginWithEmailPassword: 0,
    			loginWithGoogle: 1,
    			logout: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Auth",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get useRedirect() {
    		throw new Error("<Auth>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useRedirect(value) {
    		throw new Error("<Auth>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loginWithEmailPassword() {
    		return this.$$.ctx[0];
    	}

    	set loginWithEmailPassword(value) {
    		throw new Error("<Auth>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loginWithGoogle() {
    		return this.$$.ctx[1];
    	}

    	set loginWithGoogle(value) {
    		throw new Error("<Auth>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logout() {
    		return this.$$.ctx[2];
    	}

    	set logout(value) {
    		throw new Error("<Auth>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Adoption/Adopt.svelte generated by Svelte v3.35.0 */
    const file$f = "src/Adoption/Adopt.svelte";

    // (49:12) {#if !loggedIn}
    function create_if_block_1$3(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "You must sign in/register to adopt a frog";
    			attr_dev(p, "class", "svelte-845cko");
    			add_location(p, file$f, 49, 12, 932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(49:12) {#if !loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (59:14) {:else}
    function create_else_block$3(ctx) {
    	let div1;
    	let form;
    	let div0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			form = element("form");
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Sign In with Google";
    			attr_dev(button, "type", "button");
    			add_location(button, file$f, 62, 22, 1446);
    			attr_dev(div0, "class", "mt-3");
    			add_location(div0, file$f, 61, 20, 1405);
    			attr_dev(form, "class", "svelte-845cko");
    			add_location(form, file$f, 60, 18, 1353);
    			attr_dev(div1, "class", "w-full max-w-xs");
    			add_location(div1, file$f, 59, 16, 1305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, form);
    			append_dev(form, div0);
    			append_dev(div0, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button,
    						"click",
    						prevent_default(function () {
    							if (is_function(/*loginWithGoogle*/ ctx[6])) /*loginWithGoogle*/ ctx[6].apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(59:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:14) {#if loggedIn}
    function create_if_block$6(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t0;
    	let t1_value = /*user*/ ctx[4].email + "";
    	let t1;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text("Logged in as ");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			button.textContent = "Logout";
    			attr_dev(h2, "class", "svelte-845cko");
    			add_location(h2, file$f, 54, 20, 1095);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "mt-3");
    			add_location(button, file$f, 55, 20, 1150);
    			add_location(div0, file$f, 53, 18, 1069);
    			add_location(div1, file$f, 52, 16, 1045);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(div0, t2);
    			append_dev(div0, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*logout*/ ctx[7])) /*logout*/ ctx[7].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*user*/ 16 && t1_value !== (t1_value = /*user*/ ctx[4].email + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(52:14) {#if loggedIn}",
    		ctx
    	});

    	return block;
    }

    // (42:12) <Auth               useRedirect={true}               let:user               let:loggedIn               let:loginWithGoogle               let:logout>
    function create_default_slot_3$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = !/*loggedIn*/ ctx[5] && create_if_block_1$3(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*loggedIn*/ ctx[5]) return create_if_block$6;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*loggedIn*/ ctx[5]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(42:12) <Auth               useRedirect={true}               let:user               let:loggedIn               let:loginWithGoogle               let:logout>",
    		ctx
    	});

    	return block;
    }

    // (39:4) <Modal title="Adopting a frog" on:cancel>
    function create_default_slot_2$1(ctx) {
    	let div1;
    	let div0;
    	let auth;
    	let current;

    	auth = new Auth({
    			props: {
    				useRedirect: true,
    				$$slots: {
    					default: [
    						create_default_slot_3$1,
    						({ user, loggedIn, loginWithGoogle, logout }) => ({
    							4: user,
    							5: loggedIn,
    							6: loginWithGoogle,
    							7: logout
    						}),
    						({ user, loggedIn, loginWithGoogle, logout }) => (user ? 16 : 0) | (loggedIn ? 32 : 0) | (loginWithGoogle ? 64 : 0) | (logout ? 128 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(auth.$$.fragment);
    			attr_dev(div0, "class", "wrapper");
    			add_location(div0, file$f, 40, 8, 694);
    			add_location(div1, file$f, 39, 4, 680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(auth, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const auth_changes = {};

    			if (dirty & /*$$scope, logout, user, loggedIn, loginWithGoogle*/ 496) {
    				auth_changes.$$scope = { dirty, ctx };
    			}

    			auth.$set(auth_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auth.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auth.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(auth);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(39:4) <Modal title=\\\"Adopting a frog\\\" on:cancel>",
    		ctx
    	});

    	return block;
    }

    // (74:8) <CustomButton btntype="submit" >
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Next steps!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(74:8) <CustomButton btntype=\\\"submit\\\" >",
    		ctx
    	});

    	return block;
    }

    // (75:8) <CustomButton btntype="button" on:click="{cancel}">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(75:8) <CustomButton btntype=\\\"button\\\" on:click=\\\"{cancel}\\\">",
    		ctx
    	});

    	return block;
    }

    // (73:4) 
    function create_footer_slot$2(ctx) {
    	let div;
    	let custombutton0;
    	let t;
    	let custombutton1;
    	let current;

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1 = new CustomButton({
    			props: {
    				btntype: "button",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*cancel*/ ctx[0]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(custombutton0.$$.fragment);
    			t = space();
    			create_component(custombutton1.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$f, 72, 4, 1735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(custombutton0, div, null);
    			append_dev(div, t);
    			mount_component(custombutton1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custombutton0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton0.$$.fragment, local);
    			transition_in(custombutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton0.$$.fragment, local);
    			transition_out(custombutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(custombutton0);
    			destroy_component(custombutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot$2.name,
    		type: "slot",
    		source: "(73:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Adopting a frog",
    				$$slots: {
    					footer: [create_footer_slot$2],
    					default: [create_default_slot_2$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("cancel", /*cancel_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Adopt", slots, []);
    	firebase$1.initializeApp(firebaseConfig);
    	const dispatch = createEventDispatcher();

    	function cancel() {
    		dispatch("cancel-adopt");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Adopt> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	function cancel_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$capture_state = () => ({
    		fade,
    		createEventDispatcher,
    		CustomButton,
    		Modal,
    		firebaseConfig,
    		firebase: firebase$1,
    		Auth,
    		dispatch,
    		cancel
    	});

    	return [cancel, submit_handler, cancel_handler];
    }

    class Adopt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Adopt",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/UI/Intro.svelte generated by Svelte v3.35.0 */

    const { Error: Error_1$1 } = globals;
    const file$e = "src/UI/Intro.svelte";

    // (57:4) {#if visible}
    function create_if_block$5(ctx) {
    	let h2;
    	let h2_class_value;
    	let h2_intro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			attr_dev(h2, "class", h2_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[1] ? "darkMode" : "lightMode") + " svelte-183843l"));
    			add_location(h2, file$e, 57, 4, 1156);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (default_slot) {
    				default_slot.m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*$darkModeOn*/ 2 && h2_class_value !== (h2_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[1] ? "darkMode" : "lightMode") + " svelte-183843l"))) {
    				attr_dev(h2, "class", h2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (!h2_intro) {
    				add_render_callback(() => {
    					h2_intro = create_in_transition(h2, typewriter, {});
    					h2_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(57:4) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let blockquote;
    	let current;
    	let if_block = /*visible*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			if (if_block) if_block.c();
    			add_location(blockquote, file$e, 55, 0, 1121);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);
    			if (if_block) if_block.m(blockquote, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*visible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visible*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(blockquote, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function typewriter(node, { speed = 30 }) {
    	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

    	if (!valid) {
    		throw new Error(`This transition only works on elements with a single text node child`);
    	}

    	const text = node.textContent;
    	const duration = text.length * speed;

    	return {
    		duration,
    		tick: t => {
    			const i = ~~(text.length * t);
    			node.textContent = text.slice(0, i);
    		}
    	};
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(1, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Intro", slots, ['default']);
    	let visible = false;

    	onMount(() => {
    		$$invalidate(0, visible = true);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		darkModeOn,
    		visible,
    		typewriter,
    		$darkModeOn
    	});

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [visible, $darkModeOn, $$scope, slots];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/Quiz/Question.svelte generated by Svelte v3.35.0 */

    const file$d = "src/Quiz/Question.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (75:0) {#if isAnswered}
    function create_if_block_1$2(ctx) {
    	let h5;

    	function select_block_type(ctx, dirty) {
    		if (/*isCorrect*/ ctx[2]) return create_if_block_2$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			if_block.c();
    			add_location(h5, file$d, 75, 2, 1088);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			if_block.m(h5, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(h5, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(75:0) {#if isAnswered}",
    		ctx
    	});

    	return block;
    }

    // (77:57) {:else}
    function create_else_block$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Incorrect 😬";
    			attr_dev(span, "class", "wrong svelte-3jb0ja");
    			add_location(span, file$d, 76, 64, 1157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(77:57) {:else}",
    		ctx
    	});

    	return block;
    }

    // (77:4) {#if isCorrect}
    function create_if_block_2$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Correct! 😃";
    			attr_dev(span, "class", "right svelte-3jb0ja");
    			add_location(span, file$d, 76, 19, 1112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(77:4) {#if isCorrect}",
    		ctx
    	});

    	return block;
    }

    // (81:0) {#each allAnswers as answer}
    function create_each_block$5(ctx) {
    	let button;
    	let raw_value = /*answer*/ ctx[9].answer + "";
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*answer*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "answerBtn svelte-3jb0ja");
    			button.disabled = /*isAnswered*/ ctx[3];
    			add_location(button, file$d, 81, 2, 1248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			button.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*isAnswered*/ 8) {
    				prop_dev(button, "disabled", /*isAnswered*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(81:0) {#each allAnswers as answer}",
    		ctx
    	});

    	return block;
    }

    // (87:0) {#if isAnswered}
    function create_if_block$4(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Next Question";
    			add_location(button, file$d, 88, 4, 1420);
    			add_location(div, file$d, 87, 2, 1410);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*nextQuestion*/ ctx[1])) /*nextQuestion*/ ctx[1].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(87:0) {#if isAnswered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let h3;
    	let raw_value = /*question*/ ctx[0].question + "";
    	let t0;
    	let t1;
    	let t2;
    	let if_block1_anchor;
    	let if_block0 = /*isAnswered*/ ctx[3] && create_if_block_1$2(ctx);
    	let each_value = /*allAnswers*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	let if_block1 = /*isAnswered*/ ctx[3] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(h3, file$d, 71, 0, 1030);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			h3.innerHTML = raw_value;
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*question*/ 1 && raw_value !== (raw_value = /*question*/ ctx[0].question + "")) h3.innerHTML = raw_value;
    			if (/*isAnswered*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*isAnswered, checkQuestion, allAnswers*/ 56) {
    				each_value = /*allAnswers*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t2.parentNode, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*isAnswered*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function shuffle(array) {
    	array.sort(() => Math.random() - 0.5);
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Question", slots, []);
    	let { question } = $$props;
    	let { nextQuestion } = $$props;
    	let { addToScore } = $$props;
    	let isCorrect;
    	let isAnswered = false;

    	let answers = question.incorrect_answers.map(answer => {
    		return { answer, correct: false };
    	});

    	let allAnswers = [
    		...answers,
    		{
    			answer: question.correct_answer,
    			correct: true
    		}
    	];

    	shuffle(allAnswers);

    	function checkQuestion(correct) {
    		if (!isAnswered) {
    			$$invalidate(3, isAnswered = true);
    			$$invalidate(2, isCorrect = correct);

    			if (correct) {
    				addToScore();
    			}
    		}
    	}

    	const writable_props = ["question", "nextQuestion", "addToScore"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Question> was created with unknown prop '${key}'`);
    	});

    	const click_handler = answer => checkQuestion(answer.correct);

    	$$self.$$set = $$props => {
    		if ("question" in $$props) $$invalidate(0, question = $$props.question);
    		if ("nextQuestion" in $$props) $$invalidate(1, nextQuestion = $$props.nextQuestion);
    		if ("addToScore" in $$props) $$invalidate(6, addToScore = $$props.addToScore);
    	};

    	$$self.$capture_state = () => ({
    		question,
    		nextQuestion,
    		addToScore,
    		isCorrect,
    		isAnswered,
    		answers,
    		allAnswers,
    		shuffle,
    		checkQuestion
    	});

    	$$self.$inject_state = $$props => {
    		if ("question" in $$props) $$invalidate(0, question = $$props.question);
    		if ("nextQuestion" in $$props) $$invalidate(1, nextQuestion = $$props.nextQuestion);
    		if ("addToScore" in $$props) $$invalidate(6, addToScore = $$props.addToScore);
    		if ("isCorrect" in $$props) $$invalidate(2, isCorrect = $$props.isCorrect);
    		if ("isAnswered" in $$props) $$invalidate(3, isAnswered = $$props.isAnswered);
    		if ("answers" in $$props) answers = $$props.answers;
    		if ("allAnswers" in $$props) $$invalidate(4, allAnswers = $$props.allAnswers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		question,
    		nextQuestion,
    		isCorrect,
    		isAnswered,
    		allAnswers,
    		checkQuestion,
    		addToScore,
    		click_handler
    	];
    }

    class Question extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			question: 0,
    			nextQuestion: 1,
    			addToScore: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*question*/ ctx[0] === undefined && !("question" in props)) {
    			console.warn("<Question> was created without expected prop 'question'");
    		}

    		if (/*nextQuestion*/ ctx[1] === undefined && !("nextQuestion" in props)) {
    			console.warn("<Question> was created without expected prop 'nextQuestion'");
    		}

    		if (/*addToScore*/ ctx[6] === undefined && !("addToScore" in props)) {
    			console.warn("<Question> was created without expected prop 'addToScore'");
    		}
    	}

    	get question() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set question(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nextQuestion() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nextQuestion(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addToScore() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addToScore(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Quiz/Quiz.svelte generated by Svelte v3.35.0 */
    const file$c = "src/Quiz/Quiz.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (74:2) {:else}
    function create_else_block$1(ctx) {
    	let h3;
    	let t0;
    	let t1;
    	let t2;
    	let h4;
    	let t3;
    	let t4_value = /*activeQuestion*/ ctx[0] + 1 + "";
    	let t4;
    	let t5;
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 10,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*quiz*/ ctx[2], info);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("My Score: ");
    			t1 = text(/*score*/ ctx[1]);
    			t2 = space();
    			h4 = element("h4");
    			t3 = text("Question #");
    			t4 = text(t4_value);
    			t5 = space();
    			await_block_anchor = empty();
    			info.block.c();
    			add_location(h3, file$c, 74, 2, 1444);
    			add_location(h4, file$c, 75, 2, 1473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t3);
    			append_dev(h4, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*score*/ 2) set_data_dev(t1, /*score*/ ctx[1]);
    			if ((!current || dirty & /*activeQuestion*/ 1) && t4_value !== (t4_value = /*activeQuestion*/ ctx[0] + 1 + "")) set_data_dev(t4, t4_value);
    			info.ctx = ctx;

    			if (dirty & /*quiz*/ 4 && promise !== (promise = /*quiz*/ ctx[2]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[10] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(74:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (72:2) {#if preventRestart === false}
    function create_if_block_1$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start New Quiz";
    			add_location(button, file$c, 72, 2, 1379);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*resetQuiz*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(72:2) {#if preventRestart === false}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur, fly, slide, scale }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop$1,
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import { fade, blur, fly, slide, scale }",
    		ctx
    	});

    	return block;
    }

    // (81:2) {:then data}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*data*/ ctx[10].results;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*addToScore, nextQuestion, quiz, activeQuestion*/ 325) {
    				each_value = /*data*/ ctx[10].results;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(81:2) {:then data}",
    		ctx
    	});

    	return block;
    }

    // (84:6) {#if index === activeQuestion}
    function create_if_block_2$1(ctx) {
    	let div;
    	let question;
    	let t;
    	let div_intro;
    	let current;

    	question = new Question({
    			props: {
    				addToScore: /*addToScore*/ ctx[8],
    				nextQuestion: /*nextQuestion*/ ctx[6],
    				question: /*question*/ ctx[11]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(question.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "fade-wrapper svelte-1d2crcx");
    			add_location(div, file$c, 84, 8, 1654);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(question, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const question_changes = {};
    			if (dirty & /*quiz*/ 4) question_changes.question = /*question*/ ctx[11];
    			question.$set(question_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(question.$$.fragment, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(question.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(question);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(84:6) {#if index === activeQuestion}",
    		ctx
    	});

    	return block;
    }

    // (83:4) {#each data.results as question, index}
    function create_each_block$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*index*/ ctx[13] === /*activeQuestion*/ ctx[0] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*index*/ ctx[13] === /*activeQuestion*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*activeQuestion*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(83:4) {#each data.results as question, index}",
    		ctx
    	});

    	return block;
    }

    // (79:15)      Loading....   {:then data}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading....");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(79:15)      Loading....   {:then data}",
    		ctx
    	});

    	return block;
    }

    // (94:2) {#if gameOver === true}
    function create_if_block$3(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Game Over",
    				$$slots: {
    					footer: [create_footer_slot$1],
    					default: [create_default_slot_1$3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, score*/ 16386) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(94:2) {#if gameOver === true}",
    		ctx
    	});

    	return block;
    }

    // (95:2) <Modal title="Game Over">
    function create_default_slot_1$3(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("You got ");
    			t1 = text(/*score*/ ctx[1]);
    			t2 = text("/10");
    			add_location(h1, file$c, 96, 6, 1881);
    			add_location(div, file$c, 95, 4, 1869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*score*/ 2) set_data_dev(t1, /*score*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(95:2) <Modal title=\\\"Game Over\\\">",
    		ctx
    	});

    	return block;
    }

    // (100:6) <CustomButton btntype="button" on:click="{hideModal}">
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(100:6) <CustomButton btntype=\\\"button\\\" on:click=\\\"{hideModal}\\\">",
    		ctx
    	});

    	return block;
    }

    // (99:4) 
    function create_footer_slot$1(ctx) {
    	let div;
    	let custombutton;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				btntype: "button",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton.$on("click", /*hideModal*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(custombutton.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$c, 98, 4, 1924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(custombutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				custombutton_changes.$$scope = { dirty, ctx };
    			}

    			custombutton.$set(custombutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(custombutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot$1.name,
    		type: "slot",
    		source: "(99:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let div_class_value;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*preventRestart*/ ctx[4] === false) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*gameOver*/ ctx[3] === true && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Nature Quiz";
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			add_location(h1, file$c, 70, 2, 1323);

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "question-wrapper-dark"
    			: "question-wrapper-light") + " svelte-1d2crcx"));

    			add_location(div, file$c, 69, 0, 1240);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t2);
    			}

    			if (/*gameOver*/ ctx[3] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*gameOver*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$darkModeOn*/ 32 && div_class_value !== (div_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "question-wrapper-dark"
    			: "question-wrapper-light") + " svelte-1d2crcx"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function getQuiz() {
    	const res = await fetch("https://opentdb.com/api.php?amount=10&category=27");
    	const quiz = await res.json();
    	return quiz;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(5, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Quiz", slots, []);
    	let activeQuestion = 0;
    	let score = 0;
    	let quiz = getQuiz();
    	let gameOver = false;
    	let preventRestart = true;

    	function nextQuestion() {
    		$$invalidate(0, activeQuestion = activeQuestion + 1);
    	}

    	function resetQuiz() {
    		$$invalidate(1, score = 0);
    		$$invalidate(2, quiz = getQuiz());
    		$$invalidate(3, gameOver = false);
    		$$invalidate(4, preventRestart = true);
    	}

    	function addToScore() {
    		$$invalidate(1, score = score + 1);
    	}

    	function hideModal() {
    		$$invalidate(3, gameOver = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Quiz> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		blur,
    		fly,
    		slide,
    		scale,
    		Question,
    		Modal,
    		CustomButton,
    		darkModeOn,
    		activeQuestion,
    		score,
    		quiz,
    		gameOver,
    		preventRestart,
    		getQuiz,
    		nextQuestion,
    		resetQuiz,
    		addToScore,
    		hideModal,
    		$darkModeOn
    	});

    	$$self.$inject_state = $$props => {
    		if ("activeQuestion" in $$props) $$invalidate(0, activeQuestion = $$props.activeQuestion);
    		if ("score" in $$props) $$invalidate(1, score = $$props.score);
    		if ("quiz" in $$props) $$invalidate(2, quiz = $$props.quiz);
    		if ("gameOver" in $$props) $$invalidate(3, gameOver = $$props.gameOver);
    		if ("preventRestart" in $$props) $$invalidate(4, preventRestart = $$props.preventRestart);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*activeQuestion*/ 1) {
    			if (activeQuestion === 10) {
    				$$invalidate(3, gameOver = true);
    				$$invalidate(4, preventRestart = false);
    			}
    		}
    	};

    	return [
    		activeQuestion,
    		score,
    		quiz,
    		gameOver,
    		preventRestart,
    		$darkModeOn,
    		nextQuestion,
    		resetQuiz,
    		addToScore,
    		hideModal
    	];
    }

    class Quiz extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quiz",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/UI/Footer.svelte generated by Svelte v3.35.0 */
    const file$b = "src/UI/Footer.svelte";

    function create_fragment$c(ctx) {
    	let head;
    	let link;
    	let t0;
    	let footer;
    	let div;
    	let p;
    	let t1;
    	let b;
    	let span;
    	let i;
    	let p_class_value;

    	const block = {
    		c: function create() {
    			head = element("head");
    			link = element("link");
    			t0 = space();
    			footer = element("footer");
    			div = element("div");
    			p = element("p");
    			t1 = text("2021 - ");
    			b = element("b");
    			b.textContent = "duckRabbitPy  ";
    			span = element("span");
    			i = element("i");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", "https://use.fontawesome.com/releases/v5.7.2/css/all.css");
    			attr_dev(link, "integrity", "sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr");
    			attr_dev(link, "crossorigin", "anonymous");
    			add_location(link, file$b, 31, 4, 456);
    			add_location(head, file$b, 30, 0, 445);
    			add_location(b, file$b, 36, 63, 759);
    			attr_dev(i, "class", "fab fa-github");
    			add_location(i, file$b, 36, 90, 786);
    			add_location(span, file$b, 36, 84, 780);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-1e5oqp3"));
    			add_location(p, file$b, 36, 6, 702);
    			add_location(div, file$b, 35, 4, 690);
    			attr_dev(footer, "class", "info svelte-1e5oqp3");
    			add_location(footer, file$b, 34, 2, 664);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, head, anchor);
    			append_dev(head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, p);
    			append_dev(p, t1);
    			append_dev(p, b);
    			append_dev(p, span);
    			append_dev(span, i);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$darkModeOn*/ 1 && p_class_value !== (p_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-1e5oqp3"))) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(0, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ darkModeOn, $darkModeOn });
    	return [$darkModeOn];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/UI/About.svelte generated by Svelte v3.35.0 */
    const file$a = "src/UI/About.svelte";

    function create_fragment$b(ctx) {
    	let div3;
    	let div0;
    	let h1;
    	let t0;
    	let h1_class_value;
    	let t1;
    	let h2;
    	let t2;
    	let h2_class_value;
    	let t3;
    	let h4;
    	let t4;
    	let h4_class_value;
    	let t5;
    	let p;
    	let t6;
    	let a0;
    	let t7;
    	let a0_class_value;
    	let t8;
    	let br0;
    	let t9;
    	let br1;
    	let t10;
    	let a1;
    	let t11;
    	let a1_class_value;
    	let t12;
    	let br2;
    	let t13;
    	let br3;
    	let t14;
    	let p_class_value;
    	let t15;
    	let h3;
    	let t16;
    	let h3_class_value;
    	let t17;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t18;
    	let img1;
    	let img1_src_value;
    	let t19;
    	let img2;
    	let img2_src_value;
    	let t20;
    	let img3;
    	let img3_src_value;
    	let t21;
    	let img4;
    	let img4_src_value;
    	let div1_intro;
    	let t22;
    	let div2;
    	let img5;
    	let img5_src_value;
    	let div3_intro;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("Hi i'm Oli");
    			t1 = space();
    			h2 = element("h2");
    			t2 = text("I'm an aspiring web developer from London");
    			t3 = space();
    			h4 = element("h4");
    			t4 = text("My programming ambition is to build web applications that are fast, elegant and enjoyable to use.");
    			t5 = space();
    			p = element("p");
    			t6 = text("Like many others taking a step into coding, I started my programming journey with Python. The first 'proper' project I worked on was a health and lifestyle PyQT desktop application with FitBit data integration. To overcome the limitations of desktop apps, I decided to study the Django web framework and created a ");
    			a0 = element("a");
    			t7 = text("fun platform");
    			t8 = text(" for 'glitch art' image processing. It was at that moment that I realised the power and potential of web development and I set on a path to seriously learn modern HTML, CSS and Javascript. \n   ");
    			br0 = element("br");
    			t9 = space();
    			br1 = element("br");
    			t10 = text("\n   After working on a number of personal Javascript projects including an (addictive) ");
    			a1 = element("a");
    			t11 = text("Blackjack game");
    			t12 = text(", I now consider Javascript my preferred langauge, and i'm confident and comfortable solving level 5 kata in CodeWars and 'advent of code' challenges using ES6 practices.\n   ");
    			br2 = element("br");
    			t13 = space();
    			br3 = element("br");
    			t14 = text("\n    My current frontend framework of choice is Svelte, it is an excellent tool for building performant Single Page Applications and is the framework that this portfolio was made with! Despite the relative obscurity of Svelte I believe it is a great framework for learning component based architecture as well as state management. The skills I have developed will be transferable to technologies such as React, Angular and Vue.");
    			t15 = space();
    			h3 = element("h3");
    			t16 = text("My core competencies:");
    			t17 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t18 = space();
    			img1 = element("img");
    			t19 = space();
    			img2 = element("img");
    			t20 = space();
    			img3 = element("img");
    			t21 = space();
    			img4 = element("img");
    			t22 = space();
    			div2 = element("div");
    			img5 = element("img");
    			attr_dev(h1, "class", h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"));
    			add_location(h1, file$a, 101, 0, 1811);
    			attr_dev(h2, "class", h2_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"));
    			add_location(h2, file$a, 102, 0, 1878);
    			attr_dev(h4, "class", h4_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"));
    			add_location(h4, file$a, 103, 0, 1976);

    			attr_dev(a0, "class", a0_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "darkModeLink"
    			: "lightModeLink") + " svelte-a8j57k"));

    			attr_dev(a0, "target", "blank");
    			attr_dev(a0, "href", "https://cyclone.pythonanywhere.com/");
    			add_location(a0, file$a, 106, 364, 2500);
    			add_location(br0, file$a, 107, 3, 2824);
    			add_location(br1, file$a, 108, 3, 2832);

    			attr_dev(a1, "class", a1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "darkModeLink"
    			: "lightModeLink") + " svelte-a8j57k"));

    			attr_dev(a1, "target", "blank");
    			attr_dev(a1, "href", "https://duckrabbitpython.pythonanywhere.com/blackJack");
    			add_location(a1, file$a, 109, 86, 2923);
    			add_location(br2, file$a, 110, 3, 3249);
    			add_location(br3, file$a, 111, 3, 3257);
    			attr_dev(p, "class", p_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"));
    			add_location(p, file$a, 106, 0, 2136);
    			attr_dev(h3, "class", h3_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"));
    			add_location(h3, file$a, 113, 4, 3698);
    			attr_dev(div0, "class", "textInfo svelte-a8j57k");
    			add_location(div0, file$a, 100, 0, 1787);
    			attr_dev(img0, "class", "compIcons svelte-a8j57k");
    			if (img0.src !== (img0_src_value = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "svelte logo");
    			add_location(img0, file$a, 118, 4, 3828);
    			attr_dev(img1, "class", "compIcons svelte-a8j57k");
    			if (img1.src !== (img1_src_value = "https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "javascript logo");
    			add_location(img1, file$a, 119, 4, 3981);
    			attr_dev(img2, "class", "compIcons svelte-a8j57k");
    			if (img2.src !== (img2_src_value = "https://miro.medium.com/max/792/1*lJ32Bl-lHWmNMUSiSq17gQ.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "css and html logo");
    			add_location(img2, file$a, 120, 4, 4112);
    			attr_dev(img3, "class", "compIcons svelte-a8j57k");
    			if (img3.src !== (img3_src_value = "https://automationpanda.files.wordpress.com/2017/09/django-logo-negative.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "django logo");
    			add_location(img3, file$a, 121, 4, 4231);
    			attr_dev(img4, "class", "compIcons svelte-a8j57k");
    			if (img4.src !== (img4_src_value = "https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/267_Python-512.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "python logo");
    			add_location(img4, file$a, 122, 4, 4360);
    			attr_dev(div1, "class", "iconContainer svelte-a8j57k");
    			add_location(div1, file$a, 116, 0, 3784);
    			attr_dev(img5, "class", "profileImg svelte-a8j57k");
    			if (img5.src !== (img5_src_value = "https://lh3.googleusercontent.com/pw/ACtC-3cb-aP7FxlsJshnVGZ1NCOpirBBTlAxygBxiuFzFrWG5W1OvTsctH5GxSgDDaWLrg5giPiuKAdv55pB9874sz-bj78IO-k_DUoTU3sHGKDNutDBs3RL8tbfBsLy1-gmf3TUTJATY75TrVusjmuSeckz=w1124-h1420-no?authuser=0")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "profile");
    			add_location(img5, file$a, 126, 0, 4526);
    			attr_dev(div2, "class", "profilePic svelte-a8j57k");
    			add_location(div2, file$a, 125, 0, 4501);
    			attr_dev(div3, "class", "container svelte-a8j57k");
    			add_location(div3, file$a, 98, 0, 1751);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h2);
    			append_dev(h2, t2);
    			append_dev(div0, t3);
    			append_dev(div0, h4);
    			append_dev(h4, t4);
    			append_dev(div0, t5);
    			append_dev(div0, p);
    			append_dev(p, t6);
    			append_dev(p, a0);
    			append_dev(a0, t7);
    			append_dev(p, t8);
    			append_dev(p, br0);
    			append_dev(p, t9);
    			append_dev(p, br1);
    			append_dev(p, t10);
    			append_dev(p, a1);
    			append_dev(a1, t11);
    			append_dev(p, t12);
    			append_dev(p, br2);
    			append_dev(p, t13);
    			append_dev(p, br3);
    			append_dev(p, t14);
    			append_dev(div0, t15);
    			append_dev(div0, h3);
    			append_dev(h3, t16);
    			append_dev(div3, t17);
    			append_dev(div3, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t18);
    			append_dev(div1, img1);
    			append_dev(div1, t19);
    			append_dev(div1, img2);
    			append_dev(div1, t20);
    			append_dev(div1, img3);
    			append_dev(div1, t21);
    			append_dev(div1, img4);
    			append_dev(div3, t22);
    			append_dev(div3, div2);
    			append_dev(div2, img5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$darkModeOn*/ 1 && h1_class_value !== (h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"))) {
    				attr_dev(h1, "class", h1_class_value);
    			}

    			if (dirty & /*$darkModeOn*/ 1 && h2_class_value !== (h2_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"))) {
    				attr_dev(h2, "class", h2_class_value);
    			}

    			if (dirty & /*$darkModeOn*/ 1 && h4_class_value !== (h4_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"))) {
    				attr_dev(h4, "class", h4_class_value);
    			}

    			if (dirty & /*$darkModeOn*/ 1 && a0_class_value !== (a0_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "darkModeLink"
    			: "lightModeLink") + " svelte-a8j57k"))) {
    				attr_dev(a0, "class", a0_class_value);
    			}

    			if (dirty & /*$darkModeOn*/ 1 && a1_class_value !== (a1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "darkModeLink"
    			: "lightModeLink") + " svelte-a8j57k"))) {
    				attr_dev(a1, "class", a1_class_value);
    			}

    			if (dirty & /*$darkModeOn*/ 1 && p_class_value !== (p_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"))) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (dirty & /*$darkModeOn*/ 1 && h3_class_value !== (h3_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "darkMode" : "lightMode") + " svelte-a8j57k"))) {
    				attr_dev(h3, "class", h3_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div1_intro) {
    				add_render_callback(() => {
    					div1_intro = create_in_transition(div1, fade, {});
    					div1_intro.start();
    				});
    			}

    			if (!div3_intro) {
    				add_render_callback(() => {
    					div3_intro = create_in_transition(div3, fly, {});
    					div3_intro.start();
    				});
    			}
    		},
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(0, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade, fly, darkModeOn, $darkModeOn });
    	return [$darkModeOn];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    //default item in cart
    const cart = writable([
      {
        id: 's8',
        title: 'Frog wallpaper download',
        price: 0.00,
      },
    ]);


    const customCart = {
      subscribe: cart.subscribe,
      addItem: item => {
        cart.update(items => {
          if (items.find(i => i.id === item.id)) {
            return [...items];
          }
          return [...items, item];
        });
      },
      removeItem: id => {
        cart.update(items => {
          return items.filter(i => i.id !== id);
        });
      },
    };


    const total = writable(0);

    const products = writable([
      {
        id: 'p1',
        title: 'Frog T-shirt',
        price: 25,
        description: 'Available in all sizes',
        srcVar: 'https://www.thebearhug.com/images/the-bearhug-co-ltd-laser-frog-t-shirt-p958-8377_medium.jpg'
      },
      {
        id: 'p2',
        title: 'Frog Mug',
        price: 6,
        description: "Sweeeeeeeeet frog mug. BUY IT",
        srcVar: 'https://img.ltwebstatic.com/images3_pi/2020/12/03/160697495119c005d9d00195e053fdf06c4c7ae50d_thumbnail_900x.webp'
      },
      {
        id: 'p3',
        title: 'Frog tea lights',
        price: 4.5,
        description: "Cosy and fragrant",
        srcVar: 'https://i.etsystatic.com/12941269/r/il/a9c128/998648306/il_1588xN.998648306_13wj.jpg'
      },
      {
        id: 'p4',
        title: 'Frog music album',
        price: 8,
        description: "Frog lyrics and slap bass tunes",
        srcVar: 'http://www.progarchives.com/progressive_rock_discography_covers/10980/cover_3211152782019_r.jpg'
      },
      {
        id: 'p5',
        title: 'FrogStation 7',
        price: 248,
        description: "Modern gaming for modern times",
        srcVar: 'https://www.decalgirl.com/assets/items/xboc/800/xboc-frog.5.jpg'
      },

    ]);

    /* src/Cart/CartItem.svelte generated by Svelte v3.35.0 */
    const file$9 = "src/Cart/CartItem.svelte";

    // (68:2) <CustomButton mode="outline" on:click={displayDescription}>
    function create_default_slot_1$2(ctx) {
    	let t_value = (/*showDescription*/ ctx[2]
    	? "Hide Description"
    	: "Show Description") + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*showDescription*/ 4 && t_value !== (t_value = (/*showDescription*/ ctx[2]
    			? "Hide Description"
    			: "Show Description") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(68:2) <CustomButton mode=\\\"outline\\\" on:click={displayDescription}>",
    		ctx
    	});

    	return block;
    }

    // (71:2) <CustomButton on:click={removeFromCart}>
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Remove from Cart");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(71:2) <CustomButton on:click={removeFromCart}>",
    		ctx
    	});

    	return block;
    }

    // (72:2) {#if showDescription}
    function create_if_block$2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*description*/ ctx[3]);
    			add_location(p, file$9, 72, 4, 1604);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*description*/ 8) set_data_dev(t, /*description*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(72:2) {#if showDescription}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let li;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let t4;
    	let custombutton0;
    	let t5;
    	let custombutton1;
    	let t6;
    	let li_class_value;
    	let current;

    	custombutton0 = new CustomButton({
    			props: {
    				mode: "outline",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*displayDescription*/ ctx[5]);

    	custombutton1 = new CustomButton({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*removeFromCart*/ ctx[6]);
    	let if_block = /*showDescription*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text("£");
    			t3 = text(/*price*/ ctx[1]);
    			t4 = space();
    			create_component(custombutton0.$$.fragment);
    			t5 = space();
    			create_component(custombutton1.$$.fragment);
    			t6 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-1dohc8w");
    			add_location(h1, file$9, 65, 2, 1321);
    			attr_dev(h2, "class", "svelte-1dohc8w");
    			add_location(h2, file$9, 66, 2, 1340);
    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[4] ? "li-dark" : "li-light") + " svelte-1dohc8w"));
    			add_location(li, file$9, 64, 0, 1267);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, h1);
    			append_dev(h1, t0);
    			append_dev(li, t1);
    			append_dev(li, h2);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(li, t4);
    			mount_component(custombutton0, li, null);
    			append_dev(li, t5);
    			mount_component(custombutton1, li, null);
    			append_dev(li, t6);
    			if (if_block) if_block.m(li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*price*/ 2) set_data_dev(t3, /*price*/ ctx[1]);
    			const custombutton0_changes = {};

    			if (dirty & /*$$scope, showDescription*/ 516) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);

    			if (/*showDescription*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*$darkModeOn*/ 16 && li_class_value !== (li_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[4] ? "li-dark" : "li-light") + " svelte-1dohc8w"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton0.$$.fragment, local);
    			transition_in(custombutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton0.$$.fragment, local);
    			transition_out(custombutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(custombutton0);
    			destroy_component(custombutton1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $total;
    	let $darkModeOn;
    	validate_store(total, "total");
    	component_subscribe($$self, total, $$value => $$invalidate(8, $total = $$value));
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(4, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CartItem", slots, []);
    	let { title } = $$props;
    	let { price } = $$props;
    	let { id } = $$props;
    	let showDescription = false;
    	let description = "Awesome FREE 4k resolution download, be the envy of your friends!";

    	function displayDescription() {
    		$$invalidate(2, showDescription = !showDescription);

    		const unsubscribe = products.subscribe(prods => {
    			$$invalidate(3, description = prods.find(p => p.id === id).description);
    		});

    		unsubscribe();
    	}

    	function removeFromCart() {
    		customCart.removeItem(id);
    		set_store_value(total, $total -= price, $total);
    	}

    	const writable_props = ["title", "price", "id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CartItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("id" in $$props) $$invalidate(7, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		cartItems: customCart,
    		products,
    		CustomButton,
    		total,
    		darkModeOn,
    		title,
    		price,
    		id,
    		showDescription,
    		description,
    		displayDescription,
    		removeFromCart,
    		$total,
    		$darkModeOn
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("id" in $$props) $$invalidate(7, id = $$props.id);
    		if ("showDescription" in $$props) $$invalidate(2, showDescription = $$props.showDescription);
    		if ("description" in $$props) $$invalidate(3, description = $$props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		price,
    		showDescription,
    		description,
    		$darkModeOn,
    		displayDescription,
    		removeFromCart,
    		id
    	];
    }

    class CartItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { title: 0, price: 1, id: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CartItem",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<CartItem> was created without expected prop 'title'");
    		}

    		if (/*price*/ ctx[1] === undefined && !("price" in props)) {
    			console.warn("<CartItem> was created without expected prop 'price'");
    		}

    		if (/*id*/ ctx[7] === undefined && !("id" in props)) {
    			console.warn("<CartItem> was created without expected prop 'id'");
    		}
    	}

    	get title() {
    		throw new Error("<CartItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CartItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get price() {
    		throw new Error("<CartItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set price(value) {
    		throw new Error("<CartItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<CartItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<CartItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Cart/Cart.svelte generated by Svelte v3.35.0 */
    const file$8 = "src/Cart/Cart.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (40:4) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No items in cart yet!";
    			add_location(p, file$8, 40, 6, 759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(40:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#each $cartItems as item (item.id)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let cartitem;
    	let current;

    	cartitem = new CartItem({
    			props: {
    				id: /*item*/ ctx[3].id,
    				title: /*item*/ ctx[3].title,
    				price: /*item*/ ctx[3].price
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(cartitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(cartitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const cartitem_changes = {};
    			if (dirty & /*$cartItems*/ 4) cartitem_changes.id = /*item*/ ctx[3].id;
    			if (dirty & /*$cartItems*/ 4) cartitem_changes.title = /*item*/ ctx[3].title;
    			if (dirty & /*$cartItems*/ 4) cartitem_changes.price = /*item*/ ctx[3].price;
    			cartitem.$set(cartitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cartitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cartitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(cartitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(38:4) {#each $cartItems as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let section;
    	let h1;
    	let t0;
    	let h1_class_value;
    	let t1;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let h3;
    	let t3;
    	let t4;
    	let h3_class_value;
    	let section_intro;
    	let current;
    	let each_value = /*$cartItems*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[3].id;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block(ctx);
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			t0 = text("Cart");
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t2 = space();
    			h3 = element("h3");
    			t3 = text("Total: £");
    			t4 = text(/*total*/ ctx[0]);
    			attr_dev(h1, "class", h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[1] ? "cart-dark" : "cart-light") + " svelte-2eolnu"));
    			add_location(h1, file$8, 35, 2, 558);
    			attr_dev(h3, "class", h3_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[1] ? "cart-dark" : "cart-light") + " svelte-2eolnu"));
    			add_location(h3, file$8, 42, 4, 804);
    			attr_dev(ul, "class", "svelte-2eolnu");
    			add_location(ul, file$8, 36, 2, 625);
    			attr_dev(section, "class", "svelte-2eolnu");
    			add_location(section, file$8, 34, 0, 537);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(h1, t0);
    			append_dev(section, t1);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}

    			append_dev(ul, t2);
    			append_dev(ul, h3);
    			append_dev(h3, t3);
    			append_dev(h3, t4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$darkModeOn*/ 2 && h1_class_value !== (h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[1] ? "cart-dark" : "cart-light") + " svelte-2eolnu"))) {
    				attr_dev(h1, "class", h1_class_value);
    			}

    			if (dirty & /*$cartItems*/ 4) {
    				each_value = /*$cartItems*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$3, t2, get_each_context$3);
    				check_outros();

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, t2);
    				}
    			}

    			if (!current || dirty & /*total*/ 1) set_data_dev(t4, /*total*/ ctx[0]);

    			if (!current || dirty & /*$darkModeOn*/ 2 && h3_class_value !== (h3_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[1] ? "cart-dark" : "cart-light") + " svelte-2eolnu"))) {
    				attr_dev(h3, "class", h3_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			if (!section_intro) {
    				add_render_callback(() => {
    					section_intro = create_in_transition(section, scale, {});
    					section_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	let $cartItems;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(1, $darkModeOn = $$value));
    	validate_store(customCart, "cartItems");
    	component_subscribe($$self, customCart, $$value => $$invalidate(2, $cartItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cart", slots, []);
    	let { total } = $$props;
    	const writable_props = ["total"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cart> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("total" in $$props) $$invalidate(0, total = $$props.total);
    	};

    	$$self.$capture_state = () => ({
    		cartItems: customCart,
    		CartItem,
    		darkModeOn,
    		fade,
    		blur,
    		fly,
    		slide,
    		scale,
    		total,
    		$darkModeOn,
    		$cartItems
    	});

    	$$self.$inject_state = $$props => {
    		if ("total" in $$props) $$invalidate(0, total = $$props.total);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [total, $darkModeOn, $cartItems];
    }

    class Cart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { total: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cart",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*total*/ ctx[0] === undefined && !("total" in props)) {
    			console.warn("<Cart> was created without expected prop 'total'");
    		}
    	}

    	get total() {
    		throw new Error("<Cart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total(value) {
    		throw new Error("<Cart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Cart/CheckOut.svelte generated by Svelte v3.35.0 */
    const file$7 = "src/Cart/CheckOut.svelte";

    // (29:8) <Modal title="CheckOut" on:cancel>
    function create_default_slot_1$1(ctx) {
    	let form;
    	let form_intro;
    	let t0;
    	let h3;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let img;
    	let img_src_value;
    	let t5;
    	let p;

    	const block = {
    		c: function create() {
    			form = element("form");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text("£");
    			t2 = text(/*$total*/ ctx[0]);
    			t3 = text(" for all that 🐸🐸🐸 goodness, what a bargain!");
    			t4 = space();
    			img = element("img");
    			t5 = space();
    			p = element("p");
    			p.textContent = "Demo site: no payment or financial details will be taken";
    			attr_dev(form, "class", "svelte-wwxgf7");
    			add_location(form, file$7, 29, 8, 621);
    			add_location(h3, file$7, 32, 8, 669);
    			if (img.src !== (img_src_value = "https://support.pixelunion.net/hc/article_attachments/360060934313/Additional_checkout_buttons_on_the_cart_page.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "dummyPayment");
    			attr_dev(img, "class", "svelte-wwxgf7");
    			add_location(img, file$7, 33, 8, 742);
    			attr_dev(p, "class", "svelte-wwxgf7");
    			add_location(p, file$7, 34, 8, 897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    			append_dev(h3, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$total*/ 1) set_data_dev(t2, /*$total*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (!form_intro) {
    				add_render_callback(() => {
    					form_intro = create_in_transition(form, fade, {});
    					form_intro.start();
    				});
    			}
    		},
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(29:8) <Modal title=\\\"CheckOut\\\" on:cancel>",
    		ctx
    	});

    	return block;
    }

    // (37:12) <CustomButton btntype="button" on:click="{cancel}">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(37:12) <CustomButton btntype=\\\"button\\\" on:click=\\\"{cancel}\\\">",
    		ctx
    	});

    	return block;
    }

    // (36:8) 
    function create_footer_slot(ctx) {
    	let div;
    	let custombutton;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				btntype: "button",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton.$on("click", /*cancel*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(custombutton.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$7, 35, 8, 969);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(custombutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				custombutton_changes.$$scope = { dirty, ctx };
    			}

    			custombutton.$set(custombutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(custombutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(36:8) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "CheckOut",
    				$$slots: {
    					footer: [create_footer_slot],
    					default: [create_default_slot_1$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("cancel", /*cancel_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, $total*/ 17) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $total;
    	validate_store(total, "total");
    	component_subscribe($$self, total, $$value => $$invalidate(0, $total = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CheckOut", slots, []);
    	const dispatch = createEventDispatcher();

    	function cancel() {
    		dispatch("cancel-checkOut");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CheckOut> was created with unknown prop '${key}'`);
    	});

    	function cancel_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$capture_state = () => ({
    		fade,
    		createEventDispatcher,
    		CustomButton,
    		Modal,
    		total,
    		dispatch,
    		cancel,
    		$total
    	});

    	return [$total, cancel, cancel_handler];
    }

    class CheckOut extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckOut",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/Products/Product.svelte generated by Svelte v3.35.0 */

    const file$6 = "src/Products/Product.svelte";

    // (92:4) <CustomButton on:click={addToCart}>
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add to Cart");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(92:4) <CustomButton on:click={addToCart}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let t4;
    	let img;
    	let img_src_value;
    	let t5;
    	let p0;
    	let t6;
    	let t7;
    	let p1;
    	let t8;
    	let t9;
    	let div1;
    	let custombutton;
    	let div2_class_value;
    	let div2_intro;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton.$on("click", /*addToCart*/ ctx[6]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text("£");
    			t3 = text(/*price*/ ctx[1]);
    			t4 = space();
    			img = element("img");
    			t5 = space();
    			p0 = element("p");
    			t6 = text(/*description*/ ctx[2]);
    			t7 = space();
    			p1 = element("p");
    			t8 = text(/*isInCart*/ ctx[4]);
    			t9 = space();
    			div1 = element("div");
    			create_component(custombutton.$$.fragment);
    			attr_dev(h1, "class", "svelte-pmgt58");
    			add_location(h1, file$6, 84, 4, 1755);
    			attr_dev(h2, "class", "svelte-pmgt58");
    			add_location(h2, file$6, 85, 4, 1776);
    			if (img.src !== (img_src_value = /*srcVar*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "product");
    			attr_dev(img, "class", "svelte-pmgt58");
    			add_location(img, file$6, 86, 4, 1798);
    			attr_dev(p0, "class", "svelte-pmgt58");
    			add_location(p0, file$6, 87, 4, 1837);
    			attr_dev(p1, "class", "isInCart svelte-pmgt58");
    			add_location(p1, file$6, 88, 4, 1862);
    			add_location(div0, file$6, 83, 2, 1745);
    			add_location(div1, file$6, 90, 2, 1908);

    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "product-dark"
    			: "product-light") + " svelte-pmgt58"));

    			add_location(div2, file$6, 82, 0, 1671);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h2);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(div0, t4);
    			append_dev(div0, img);
    			append_dev(div0, t5);
    			append_dev(div0, p0);
    			append_dev(p0, t6);
    			append_dev(div0, t7);
    			append_dev(div0, p1);
    			append_dev(p1, t8);
    			append_dev(div2, t9);
    			append_dev(div2, div1);
    			mount_component(custombutton, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*price*/ 2) set_data_dev(t3, /*price*/ ctx[1]);

    			if (!current || dirty & /*srcVar*/ 8 && img.src !== (img_src_value = /*srcVar*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*description*/ 4) set_data_dev(t6, /*description*/ ctx[2]);
    			if (!current || dirty & /*isInCart*/ 16) set_data_dev(t8, /*isInCart*/ ctx[4]);
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				custombutton_changes.$$scope = { dirty, ctx };
    			}

    			custombutton.$set(custombutton_changes);

    			if (!current || dirty & /*$darkModeOn*/ 32 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "product-dark"
    			: "product-light") + " svelte-pmgt58"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton.$$.fragment, local);

    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, scale, {});
    					div2_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(custombutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $total;
    	let $darkModeOn;
    	validate_store(total, "total");
    	component_subscribe($$self, total, $$value => $$invalidate(8, $total = $$value));
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(5, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Product", slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let { price } = $$props;
    	let { description } = $$props;
    	let { srcVar } = $$props;
    	let isInCart = "";

    	function addToCart() {
    		let currItems = get_store_value(customCart);

    		for (let x = 0; x < currItems.length; x++) {
    			if (currItems[x].id === id) {
    				$$invalidate(4, isInCart = "Hey! Leave some frogs for the rest of us!!!");
    			}
    		}

    		customCart.addItem({ id, title, price });
    		set_store_value(total, $total += price, $total);
    	}

    	const writable_props = ["id", "title", "price", "description", "srcVar"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(7, id = $$props.id);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("srcVar" in $$props) $$invalidate(3, srcVar = $$props.srcVar);
    	};

    	$$self.$capture_state = () => ({
    		cartItems: customCart,
    		CustomButton,
    		darkModeOn,
    		fade,
    		blur,
    		fly,
    		slide,
    		scale,
    		cart: customCart,
    		total,
    		id,
    		title,
    		price,
    		description,
    		srcVar,
    		isInCart,
    		get: get_store_value,
    		addToCart,
    		$total,
    		$darkModeOn
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(7, id = $$props.id);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("srcVar" in $$props) $$invalidate(3, srcVar = $$props.srcVar);
    		if ("isInCart" in $$props) $$invalidate(4, isInCart = $$props.isInCart);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, price, description, srcVar, isInCart, $darkModeOn, addToCart, id];
    }

    class Product extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			id: 7,
    			title: 0,
    			price: 1,
    			description: 2,
    			srcVar: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[7] === undefined && !("id" in props)) {
    			console.warn("<Product> was created without expected prop 'id'");
    		}

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Product> was created without expected prop 'title'");
    		}

    		if (/*price*/ ctx[1] === undefined && !("price" in props)) {
    			console.warn("<Product> was created without expected prop 'price'");
    		}

    		if (/*description*/ ctx[2] === undefined && !("description" in props)) {
    			console.warn("<Product> was created without expected prop 'description'");
    		}

    		if (/*srcVar*/ ctx[3] === undefined && !("srcVar" in props)) {
    			console.warn("<Product> was created without expected prop 'srcVar'");
    		}
    	}

    	get id() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get price() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set price(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get srcVar() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set srcVar(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Products/Products.svelte generated by Svelte v3.35.0 */
    const file$5 = "src/Products/Products.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (27:2) {#each $products as product (product.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let product;
    	let current;

    	product = new Product({
    			props: {
    				id: /*product*/ ctx[2].id,
    				title: /*product*/ ctx[2].title,
    				price: /*product*/ ctx[2].price,
    				description: /*product*/ ctx[2].description,
    				srcVar: /*product*/ ctx[2].srcVar
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(product.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(product, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const product_changes = {};
    			if (dirty & /*$products*/ 2) product_changes.id = /*product*/ ctx[2].id;
    			if (dirty & /*$products*/ 2) product_changes.title = /*product*/ ctx[2].title;
    			if (dirty & /*$products*/ 2) product_changes.price = /*product*/ ctx[2].price;
    			if (dirty & /*$products*/ 2) product_changes.description = /*product*/ ctx[2].description;
    			if (dirty & /*$products*/ 2) product_changes.srcVar = /*product*/ ctx[2].srcVar;
    			product.$set(product_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(product.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(product, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(27:2) {#each $products as product (product.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let section;
    	let h1;
    	let t0;
    	let h1_class_value;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$products*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*product*/ ctx[2].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			t0 = text("Products");
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "products-dark"
    			: "products-light") + " svelte-detab"));

    			add_location(h1, file$5, 25, 2, 382);
    			attr_dev(section, "class", "svelte-detab");
    			add_location(section, file$5, 24, 0, 370);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(h1, t0);
    			append_dev(section, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$darkModeOn*/ 1 && h1_class_value !== (h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "products-dark"
    			: "products-light") + " svelte-detab"))) {
    				attr_dev(h1, "class", h1_class_value);
    			}

    			if (dirty & /*$products*/ 2) {
    				each_value = /*$products*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	let $products;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(0, $darkModeOn = $$value));
    	validate_store(products, "products");
    	component_subscribe($$self, products, $$value => $$invalidate(1, $products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Products", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Products> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		products,
    		Product,
    		darkModeOn,
    		$darkModeOn,
    		$products
    	});

    	return [$darkModeOn, $products];
    }

    class Products extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/UI/Selector.svelte generated by Svelte v3.35.0 */
    const file$4 = "src/UI/Selector.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (28:2) {#each options as option}
    function create_each_block$1(ctx) {
    	let option;
    	let t0_value = /*option*/ ctx[6].text + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*option*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$4, 28, 3, 593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(28:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let form;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*options*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "class", "svelte-w92slz");
    			if (/*selected*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$4, 26, 1, 508);
    			add_location(form, file$4, 25, 0, 475);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selected*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
    					listen_dev(select, "blur", /*sendUpData*/ ctx[2], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options*/ 2) {
    				each_value = /*options*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selected, options*/ 3) {
    				select_option(select, /*selected*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Selector", slots, []);

    	let options = [
    		{ id: 0, text: `no rating` },
    		{ id: 1, text: `🐸` },
    		{ id: 2, text: `🐸🐸` },
    		{ id: 3, text: `🐸🐸🐸` },
    		{ id: 4, text: `🐸🐸🐸🐸` },
    		{ id: 4, text: `🐸🐸🐸🐸🐸` }
    	];

    	let selected;
    	const dispatch = createEventDispatcher();

    	function sendUpData() {
    		dispatch("pass-up-stars", selected.text);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Selector> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	function select_change_handler() {
    		selected = select_value(this);
    		$$invalidate(0, selected);
    		$$invalidate(1, options);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		options,
    		selected,
    		dispatch,
    		sendUpData
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    		if ("selected" in $$props) $$invalidate(0, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, options, sendUpData, submit_handler, select_change_handler];
    }

    class Selector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selector",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/UI/Feedback.svelte generated by Svelte v3.35.0 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;
    const file$3 = "src/UI/Feedback.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (217:2) {#each storedComments as storedComment }
    function create_each_block(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1_value = /*storedComment*/ ctx[15].User + "";
    	let t1;
    	let t2;
    	let p;
    	let i;
    	let t3_value = /*storedComment*/ ctx[15].Comment + "";
    	let t3;
    	let t4;
    	let h2;
    	let t5_value = /*storedComment*/ ctx[15].Rating + "";
    	let t5;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text("User: ");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			i = element("i");
    			t3 = text(t3_value);
    			t4 = space();
    			h2 = element("h2");
    			t5 = text(t5_value);
    			attr_dev(h3, "class", "svelte-g7nkyv");
    			add_location(h3, file$3, 218, 4, 4453);
    			add_location(i, file$3, 219, 7, 4496);
    			attr_dev(p, "class", "svelte-g7nkyv");
    			add_location(p, file$3, 219, 4, 4493);
    			attr_dev(h2, "class", "svelte-g7nkyv");
    			add_location(h2, file$3, 220, 4, 4535);

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "commentCard-dark"
    			: "commentCard-light") + " svelte-g7nkyv"));

    			add_location(div, file$3, 217, 2, 4378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, i);
    			append_dev(i, t3);
    			append_dev(div, t4);
    			append_dev(div, h2);
    			append_dev(h2, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*storedComments*/ 16 && t1_value !== (t1_value = /*storedComment*/ ctx[15].User + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*storedComments*/ 16 && t3_value !== (t3_value = /*storedComment*/ ctx[15].Comment + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*storedComments*/ 16 && t5_value !== (t5_value = /*storedComment*/ ctx[15].Rating + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*$darkModeOn*/ 32 && div_class_value !== (div_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "commentCard-dark"
    			: "commentCard-light") + " svelte-g7nkyv"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(217:2) {#each storedComments as storedComment }",
    		ctx
    	});

    	return block;
    }

    // (245:4) <CustomButton disabled={disableBtn} on:click="{sendToBase}">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*btnMsg*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*btnMsg*/ 1) set_data_dev(t, /*btnMsg*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(245:4) <CustomButton disabled={disableBtn} on:click=\\\"{sendToBase}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div0;
    	let h3;
    	let t1;
    	let p;
    	let i;
    	let t3;
    	let h2;
    	let div0_class_value;
    	let div0_intro;
    	let t5;
    	let t6;
    	let div7;
    	let div1;
    	let h1;
    	let t7;
    	let h1_class_value;
    	let t8;
    	let img;
    	let img_src_value;
    	let t9;
    	let div4;
    	let div2;
    	let header0;
    	let t11;
    	let textarea0;
    	let t12;
    	let div3;
    	let header1;
    	let t14;
    	let selector;
    	let t15;
    	let div6;
    	let textarea1;
    	let t16;
    	let div5;
    	let custombutton;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*storedComments*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	selector = new Selector({ $$inline: true });
    	selector.$on("pass-up-stars", /*setStars*/ ctx[6]);

    	custombutton = new CustomButton({
    			props: {
    				disabled: /*disableBtn*/ ctx[1],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton.$on("click", /*sendToBase*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "User: Anon";
    			t1 = space();
    			p = element("p");
    			i = element("i");
    			i.textContent = "\"Good work, keep it up, keep learning!\"";
    			t3 = space();
    			h2 = element("h2");
    			h2.textContent = "🐸🐸🐸🐸";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div7 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			t7 = text("Feedback makes me hoppy!");
    			t8 = space();
    			img = element("img");
    			t9 = space();
    			div4 = element("div");
    			div2 = element("div");
    			header0 = element("header");
    			header0.textContent = "Username (Anon by default)";
    			t11 = space();
    			textarea0 = element("textarea");
    			t12 = space();
    			div3 = element("div");
    			header1 = element("header");
    			header1.textContent = "Frog star rating";
    			t14 = space();
    			create_component(selector.$$.fragment);
    			t15 = space();
    			div6 = element("div");
    			textarea1 = element("textarea");
    			t16 = space();
    			div5 = element("div");
    			create_component(custombutton.$$.fragment);
    			attr_dev(h3, "class", "svelte-g7nkyv");
    			add_location(h3, file$3, 210, 0, 4232);
    			add_location(i, file$3, 211, 3, 4255);
    			attr_dev(p, "class", "svelte-g7nkyv");
    			add_location(p, file$3, 211, 0, 4252);
    			attr_dev(h2, "class", "svelte-g7nkyv");
    			add_location(h2, file$3, 212, 0, 4306);

    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "commentCard-dark"
    			: "commentCard-light") + " svelte-g7nkyv"));

    			add_location(div0, file$3, 209, 0, 4153);
    			attr_dev(h1, "class", h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5] ? "hoppy-dark" : "hoppy-light") + " svelte-g7nkyv"));
    			add_location(h1, file$3, 227, 6, 4642);
    			if (img.src !== (img_src_value = "/images/frog.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "frog");
    			attr_dev(img, "class", "svelte-g7nkyv");
    			add_location(img, file$3, 228, 6, 4735);
    			attr_dev(div1, "class", "h1 svelte-g7nkyv");
    			add_location(div1, file$3, 226, 2, 4619);
    			attr_dev(header0, "class", "svelte-g7nkyv");
    			add_location(header0, file$3, 233, 6, 4843);
    			textarea0.value = "Anon";
    			attr_dev(textarea0, "class", "svelte-g7nkyv");
    			add_location(textarea0, file$3, 234, 6, 4893);
    			attr_dev(div2, "class", "userInput svelte-g7nkyv");
    			add_location(div2, file$3, 232, 4, 4812);
    			attr_dev(header1, "class", "svelte-g7nkyv");
    			add_location(header1, file$3, 237, 6, 5012);
    			attr_dev(div3, "class", "rating svelte-g7nkyv");
    			add_location(div3, file$3, 236, 4, 4985);
    			attr_dev(div4, "class", "User svelte-g7nkyv");
    			add_location(div4, file$3, 231, 2, 4789);
    			attr_dev(textarea1, "class", "commentInput svelte-g7nkyv");
    			add_location(textarea1, file$3, 242, 2, 5140);
    			attr_dev(div5, "class", "btnPad svelte-g7nkyv");
    			add_location(div5, file$3, 243, 2, 5239);
    			attr_dev(div6, "class", "comment svelte-g7nkyv");
    			add_location(div6, file$3, 241, 2, 5116);
    			attr_dev(div7, "class", "grid-container svelte-g7nkyv");
    			add_location(div7, file$3, 225, 0, 4588);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h3);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, i);
    			append_dev(div0, t3);
    			append_dev(div0, h2);
    			insert_dev(target, t5, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t6, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, img);
    			append_dev(div7, t9);
    			append_dev(div7, div4);
    			append_dev(div4, div2);
    			append_dev(div2, header0);
    			append_dev(div2, t11);
    			append_dev(div2, textarea0);
    			append_dev(div4, t12);
    			append_dev(div4, div3);
    			append_dev(div3, header1);
    			append_dev(div3, t14);
    			mount_component(selector, div3, null);
    			append_dev(div7, t15);
    			append_dev(div7, div6);
    			append_dev(div6, textarea1);
    			append_dev(div6, t16);
    			append_dev(div6, div5);
    			mount_component(custombutton, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea0, "input", /*input_handler*/ ctx[9], false, false, false),
    					listen_dev(textarea1, "input", /*input_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$darkModeOn*/ 32 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5]
    			? "commentCard-dark"
    			: "commentCard-light") + " svelte-g7nkyv"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*$darkModeOn, storedComments*/ 48) {
    				each_value = /*storedComments*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t6.parentNode, t6);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*$darkModeOn*/ 32 && h1_class_value !== (h1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[5] ? "hoppy-dark" : "hoppy-light") + " svelte-g7nkyv"))) {
    				attr_dev(h1, "class", h1_class_value);
    			}

    			const custombutton_changes = {};
    			if (dirty & /*disableBtn*/ 2) custombutton_changes.disabled = /*disableBtn*/ ctx[1];

    			if (dirty & /*$$scope, btnMsg*/ 262145) {
    				custombutton_changes.$$scope = { dirty, ctx };
    			}

    			custombutton.$set(custombutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (!div0_intro) {
    				add_render_callback(() => {
    					div0_intro = create_in_transition(div0, fade, {});
    					div0_intro.start();
    				});
    			}

    			transition_in(selector.$$.fragment, local);
    			transition_in(custombutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selector.$$.fragment, local);
    			transition_out(custombutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div7);
    			destroy_component(selector);
    			destroy_component(custombutton);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function createFrogStars(numStars) {
    	let numFrogs = [];

    	for (let x = 0; x < numStars; x++) {
    		numFrogs += "🐸";
    	}

    	return numFrogs;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(5, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Feedback", slots, []);
    	let { numStars } = $$props;
    	let btnMsg = "Share feedback";
    	let disableBtn = false;
    	let newUser = "";
    	let newComment = "";
    	let newRating = "";
    	let storedComments = "";

    	//for the incoming
    	let frogStars = createFrogStars(numStars);

    	//for the users
    	function setStars(event) {
    		newRating = event.detail;
    	}

    	function sendToBase() {
    		$$invalidate(0, btnMsg = "Thanks!");
    		$$invalidate(1, disableBtn = true);

    		let data = {
    			User: newUser,
    			Comment: newComment,
    			Rating: newRating
    		};

    		saveFeedback(data);
    	}

    	//GET is default if not specified
    	function getFeedback() {
    		fetch("https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/UserComments.json").then(res => {
    			if (!res.ok) {
    				throw new Error("Get request failed");
    			}

    			return res.json();
    		}).then(data => {
    			$$invalidate(4, storedComments = data);
    			$$invalidate(4, storedComments = Object.values(data));
    		}).catch(err => {
    			console.log(err);
    		});
    	}

    	

    	function saveFeedback(data) {
    		if (data) {
    			//must be .json endpoint
    			fetch(`https://svelte-firebase-bknd-default-rtdb.europe-west1.firebasedatabase.app/UserComments.json`, {
    				method: "POST",
    				body: JSON.stringify(data),
    				headers: { "Content-Type": "application/json" }
    			}).then(res => {
    				if (!res.ok) {
    					throw new Error("Post request failed");
    				}

    				//space for further data manipulatin
    				getFeedback();
    			}).catch(err => {
    				console.log(err);
    			});
    		}
    	}

    	const writable_props = ["numStars"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Feedback> was created with unknown prop '${key}'`);
    	});

    	const input_handler = event => $$invalidate(2, newUser = event.target.value);
    	const input_handler_1 = event => $$invalidate(3, newComment = event.target.value);

    	$$self.$$set = $$props => {
    		if ("numStars" in $$props) $$invalidate(8, numStars = $$props.numStars);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		CustomButton,
    		Selector,
    		darkModeOn,
    		numStars,
    		btnMsg,
    		disableBtn,
    		newUser,
    		newComment,
    		newRating,
    		storedComments,
    		frogStars,
    		createFrogStars,
    		setStars,
    		sendToBase,
    		getFeedback,
    		saveFeedback,
    		$darkModeOn
    	});

    	$$self.$inject_state = $$props => {
    		if ("numStars" in $$props) $$invalidate(8, numStars = $$props.numStars);
    		if ("btnMsg" in $$props) $$invalidate(0, btnMsg = $$props.btnMsg);
    		if ("disableBtn" in $$props) $$invalidate(1, disableBtn = $$props.disableBtn);
    		if ("newUser" in $$props) $$invalidate(2, newUser = $$props.newUser);
    		if ("newComment" in $$props) $$invalidate(3, newComment = $$props.newComment);
    		if ("newRating" in $$props) newRating = $$props.newRating;
    		if ("storedComments" in $$props) $$invalidate(4, storedComments = $$props.storedComments);
    		if ("frogStars" in $$props) frogStars = $$props.frogStars;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		btnMsg,
    		disableBtn,
    		newUser,
    		newComment,
    		storedComments,
    		$darkModeOn,
    		setStars,
    		sendToBase,
    		numStars,
    		input_handler,
    		input_handler_1
    	];
    }

    class Feedback extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { numStars: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Feedback",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*numStars*/ ctx[8] === undefined && !("numStars" in props)) {
    			console_1.warn("<Feedback> was created without expected prop 'numStars'");
    		}
    	}

    	get numStars() {
    		throw new Error_1("<Feedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numStars(value) {
    		throw new Error_1("<Feedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Quiz/Credit.svelte generated by Svelte v3.35.0 */
    const file$2 = "src/Quiz/Credit.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let p;
    	let t0;
    	let span;
    	let ul;
    	let em;
    	let a;
    	let t1;
    	let a_class_value;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("Questions provided by: ");
    			span = element("span");
    			ul = element("ul");
    			em = element("em");
    			a = element("a");
    			t1 = text("Open Trivia API");

    			attr_dev(a, "class", a_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "darkModeLink"
    			: "lightModeLink") + " svelte-1csk9kw"));

    			attr_dev(a, "href", "https://opentdb.com");
    			add_location(a, file$2, 35, 10, 691);
    			add_location(em, file$2, 34, 8, 676);
    			add_location(ul, file$2, 33, 6, 663);
    			add_location(span, file$2, 32, 30, 650);
    			add_location(p, file$2, 32, 4, 624);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "credit-dark" : "credit-light") + " svelte-1csk9kw"));
    			add_location(div, file$2, 31, 0, 559);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, span);
    			append_dev(span, ul);
    			append_dev(ul, em);
    			append_dev(em, a);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$darkModeOn*/ 1 && a_class_value !== (a_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0]
    			? "darkModeLink"
    			: "lightModeLink") + " svelte-1csk9kw"))) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (dirty & /*$darkModeOn*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[0] ? "credit-dark" : "credit-light") + " svelte-1csk9kw"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(0, $darkModeOn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Credit", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Credit> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ darkModeOn, $darkModeOn });
    	return [$darkModeOn];
    }

    class Credit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Credit",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* node_modules/svelte-toggle/src/ToggleCore.svelte generated by Svelte v3.35.0 */

    const get_default_slot_changes$1 = dirty => ({
    	label: dirty & /*label*/ 1,
    	button: dirty & /*button*/ 2
    });

    const get_default_slot_context$1 = ctx => ({
    	label: /*label*/ ctx[0],
    	button: /*button*/ ctx[1]
    });

    function create_fragment$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, label, button*/ 35) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, get_default_slot_changes$1, get_default_slot_context$1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let label;
    	let button;
    	const omit_props_names = ["id","toggled","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ToggleCore", slots, ['default']);
    	let { id = "toggle" + Math.random().toString(36) } = $$props;
    	let { toggled = true } = $$props;
    	let { disabled = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("id" in $$new_props) $$invalidate(2, id = $$new_props.id);
    		if ("toggled" in $$new_props) $$invalidate(3, toggled = $$new_props.toggled);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ id, toggled, disabled, label, button });

    	$$self.$inject_state = $$new_props => {
    		if ("id" in $$props) $$invalidate(2, id = $$new_props.id);
    		if ("toggled" in $$props) $$invalidate(3, toggled = $$new_props.toggled);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("label" in $$props) $$invalidate(0, label = $$new_props.label);
    		if ("button" in $$props) $$invalidate(1, button = $$new_props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*id*/ 4) {
    			$$invalidate(0, label = { for: id });
    		}

    		$$invalidate(1, button = {
    			...$$restProps,
    			id,
    			disabled,
    			"aria-checked": toggled,
    			type: "button",
    			role: "switch"
    		});
    	};

    	return [label, button, id, toggled, disabled, $$scope, slots];
    }

    class ToggleCore extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { id: 2, toggled: 3, disabled: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToggleCore",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get id() {
    		throw new Error("<ToggleCore>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ToggleCore>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggled() {
    		throw new Error("<ToggleCore>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggled(value) {
    		throw new Error("<ToggleCore>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ToggleCore>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ToggleCore>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-toggle/src/Toggle.svelte generated by Svelte v3.35.0 */
    const file$1 = "node_modules/svelte-toggle/src/Toggle.svelte";
    const get_default_slot_changes = dirty => ({ toggled: dirty & /*toggled*/ 1 });
    const get_default_slot_context = ctx => ({ toggled: /*toggled*/ ctx[0] });

    // (140:6) {#if on && off}
    function create_if_block$1(ctx) {
    	let span;
    	let t_value = (/*toggled*/ ctx[0] ? /*on*/ ctx[5] : /*off*/ ctx[6]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-1y1be9d");
    			add_location(span, file$1, 139, 21, 2731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*toggled, on, off*/ 97 && t_value !== (t_value = (/*toggled*/ ctx[0] ? /*on*/ ctx[5] : /*off*/ ctx[6]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(140:6) {#if on && off}",
    		ctx
    	});

    	return block;
    }

    // (139:20)        
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*on*/ ctx[5] && /*off*/ ctx[6] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*on*/ ctx[5] && /*off*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(139:20)        ",
    		ctx
    	});

    	return block;
    }

    // (123:0) <ToggleCore bind:toggled let:label={labelProps} let:button>
    function create_default_slot$1(ctx) {
    	let label_1;
    	let t0;
    	let t1;
    	let div;
    	let button;
    	let button_style_value;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	let label_1_levels = [/*labelProps*/ ctx[19]];
    	let label_1_data = {};

    	for (let i = 0; i < label_1_levels.length; i += 1) {
    		label_1_data = assign(label_1_data, label_1_levels[i]);
    	}

    	let button_levels = [
    		/*$$restProps*/ ctx[10],
    		/*button*/ ctx[20],
    		{
    			style: button_style_value = "color: " + /*switchColor*/ ctx[7] + "; background-color: " + (/*toggled*/ ctx[0]
    			? /*toggledColor*/ ctx[8]
    			: /*untoggledColor*/ ctx[9]) + ";\n      " + /*$$restProps*/ ctx[10].style
    		},
    		{ disabled: /*disabled*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = space();
    			div = element("div");
    			button = element("button");
    			t2 = space();
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(label_1, label_1_data);
    			toggle_class(label_1, "hideLabel", /*hideLabel*/ ctx[2]);
    			toggle_class(label_1, "svelte-1y1be9d", true);
    			add_location(label_1, file$1, 124, 2, 2323);
    			set_attributes(button, button_data);
    			toggle_class(button, "small", /*small*/ ctx[3]);
    			toggle_class(button, "svelte-1y1be9d", true);
    			add_location(button, file$1, 127, 4, 2391);
    			attr_dev(div, "class", "svelte-1y1be9d");
    			add_location(div, file$1, 126, 2, 2381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t2);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[15], false, false, false),
    					listen_dev(button, "focus", /*focus_handler*/ ctx[13], false, false, false),
    					listen_dev(button, "blur", /*blur_handler*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);
    			set_attributes(label_1, label_1_data = get_spread_update(label_1_levels, [dirty & /*labelProps*/ 524288 && /*labelProps*/ ctx[19]]));
    			toggle_class(label_1, "hideLabel", /*hideLabel*/ ctx[2]);
    			toggle_class(label_1, "svelte-1y1be9d", true);

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 1024 && /*$$restProps*/ ctx[10],
    				dirty & /*button*/ 1048576 && /*button*/ ctx[20],
    				(!current || dirty & /*switchColor, toggled, toggledColor, untoggledColor, $$restProps*/ 1921 && button_style_value !== (button_style_value = "color: " + /*switchColor*/ ctx[7] + "; background-color: " + (/*toggled*/ ctx[0]
    				? /*toggledColor*/ ctx[8]
    				: /*untoggledColor*/ ctx[9]) + ";\n      " + /*$$restProps*/ ctx[10].style)) && { style: button_style_value },
    				(!current || dirty & /*disabled*/ 16) && { disabled: /*disabled*/ ctx[4] }
    			]));

    			toggle_class(button, "small", /*small*/ ctx[3]);
    			toggle_class(button, "svelte-1y1be9d", true);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, toggled*/ 131073) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*toggled, on, off*/ 97) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(123:0) <ToggleCore bind:toggled let:label={labelProps} let:button>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let togglecore;
    	let updating_toggled;
    	let current;

    	function togglecore_toggled_binding(value) {
    		/*togglecore_toggled_binding*/ ctx[16](value);
    	}

    	let togglecore_props = {
    		$$slots: {
    			default: [
    				create_default_slot$1,
    				({ label: labelProps, button }) => ({ 19: labelProps, 20: button }),
    				({ label: labelProps, button }) => (labelProps ? 524288 : 0) | (button ? 1048576 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*toggled*/ ctx[0] !== void 0) {
    		togglecore_props.toggled = /*toggled*/ ctx[0];
    	}

    	togglecore = new ToggleCore({ props: togglecore_props, $$inline: true });
    	binding_callbacks.push(() => bind(togglecore, "toggled", togglecore_toggled_binding));

    	const block = {
    		c: function create() {
    			create_component(togglecore.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(togglecore, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const togglecore_changes = {};

    			if (dirty & /*$$scope, toggled, on, off, $$restProps, button, switchColor, toggledColor, untoggledColor, disabled, small, labelProps, hideLabel, label*/ 1705983) {
    				togglecore_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_toggled && dirty & /*toggled*/ 1) {
    				updating_toggled = true;
    				togglecore_changes.toggled = /*toggled*/ ctx[0];
    				add_flush_callback(() => updating_toggled = false);
    			}

    			togglecore.$set(togglecore_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(togglecore.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(togglecore.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(togglecore, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"label","hideLabel","small","toggled","disabled","on","off","switchColor","toggledColor","untoggledColor"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Toggle", slots, ['default']);
    	let { label = "Label" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { small = false } = $$props;
    	let { toggled = true } = $$props;
    	let { disabled = false } = $$props;
    	let { on = undefined } = $$props;
    	let { off = undefined } = $$props;
    	let { switchColor = "#fff" } = $$props;
    	let { toggledColor = "#0f62fe" } = $$props;
    	let { untoggledColor = "#8d8d8d" } = $$props;
    	const dispatch = createEventDispatcher();

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler_1 = () => $$invalidate(0, toggled = !toggled);

    	function togglecore_toggled_binding(value) {
    		toggled = value;
    		$$invalidate(0, toggled);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("label" in $$new_props) $$invalidate(1, label = $$new_props.label);
    		if ("hideLabel" in $$new_props) $$invalidate(2, hideLabel = $$new_props.hideLabel);
    		if ("small" in $$new_props) $$invalidate(3, small = $$new_props.small);
    		if ("toggled" in $$new_props) $$invalidate(0, toggled = $$new_props.toggled);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("on" in $$new_props) $$invalidate(5, on = $$new_props.on);
    		if ("off" in $$new_props) $$invalidate(6, off = $$new_props.off);
    		if ("switchColor" in $$new_props) $$invalidate(7, switchColor = $$new_props.switchColor);
    		if ("toggledColor" in $$new_props) $$invalidate(8, toggledColor = $$new_props.toggledColor);
    		if ("untoggledColor" in $$new_props) $$invalidate(9, untoggledColor = $$new_props.untoggledColor);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		label,
    		hideLabel,
    		small,
    		toggled,
    		disabled,
    		on,
    		off,
    		switchColor,
    		toggledColor,
    		untoggledColor,
    		createEventDispatcher,
    		ToggleCore,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("label" in $$props) $$invalidate(1, label = $$new_props.label);
    		if ("hideLabel" in $$props) $$invalidate(2, hideLabel = $$new_props.hideLabel);
    		if ("small" in $$props) $$invalidate(3, small = $$new_props.small);
    		if ("toggled" in $$props) $$invalidate(0, toggled = $$new_props.toggled);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("on" in $$props) $$invalidate(5, on = $$new_props.on);
    		if ("off" in $$props) $$invalidate(6, off = $$new_props.off);
    		if ("switchColor" in $$props) $$invalidate(7, switchColor = $$new_props.switchColor);
    		if ("toggledColor" in $$props) $$invalidate(8, toggledColor = $$new_props.toggledColor);
    		if ("untoggledColor" in $$props) $$invalidate(9, untoggledColor = $$new_props.untoggledColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toggled*/ 1) {
    			/**
     * @event {boolean} toggle
     */
    			dispatch("toggle", toggled);
    		}
    	};

    	return [
    		toggled,
    		label,
    		hideLabel,
    		small,
    		disabled,
    		on,
    		off,
    		switchColor,
    		toggledColor,
    		untoggledColor,
    		$$restProps,
    		slots,
    		click_handler,
    		focus_handler,
    		blur_handler,
    		click_handler_1,
    		togglecore_toggled_binding,
    		$$scope
    	];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			label: 1,
    			hideLabel: 2,
    			small: 3,
    			toggled: 0,
    			disabled: 4,
    			on: 5,
    			off: 6,
    			switchColor: 7,
    			toggledColor: 8,
    			untoggledColor: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get label() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggled() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggled(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get on() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set on(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get off() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set off(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get switchColor() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set switchColor(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggledColor() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggledColor(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get untoggledColor() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set untoggledColor(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */
    const file = "src/App.svelte";

    // (183:4) <CustomButton btntype="submit" on:click="{() => {mainPage = true; aboutPage = false; playQuiz = false; goShop = false; feedback = false;}}">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Main");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(183:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {mainPage = true; aboutPage = false; playQuiz = false; goShop = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (184:4) <CustomButton btntype="submit" on:click="{() => {aboutPage = true; mainPage = false; playQuiz = false; goShop = false; feedback = false;}}">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(184:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {aboutPage = true; mainPage = false; playQuiz = false; goShop = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (185:4) <CustomButton btntype="submit" on:click="{() => editMode = 'add'}">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Re-home your frog");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(185:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => editMode = 'add'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (186:4) <CustomButton btntype="submit" on:click="{() => {playQuiz = true; aboutPage = false; goShop = false; feedback = false;}}">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Nature Quiz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(186:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {playQuiz = true; aboutPage = false; goShop = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (187:4) <CustomButton btntype="submit" on:click="{() => {goShop = true; aboutPage = false; playQuiz = false; feedback = false;}}">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Frog Shop");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(187:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {goShop = true; aboutPage = false; playQuiz = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (188:4) <CustomButton btntype="submit" on:click="{() => {feedback = true; mainPage = false; goShop = false; aboutPage = false; playQuiz = false;}}">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Give Feedback");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(188:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {feedback = true; mainPage = false; goShop = false; aboutPage = false; playQuiz = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (193:4) {#if editMode === 'add'}
    function create_if_block_8(ctx) {
    	let editadopt;
    	let current;
    	editadopt = new EditAdopt({ $$inline: true });
    	editadopt.$on("adoption-submit", /*addFrog*/ ctx[13]);
    	editadopt.$on("cancel", /*cancelForm*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(editadopt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editadopt, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editadopt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editadopt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editadopt, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(193:4) {#if editMode === 'add'}",
    		ctx
    	});

    	return block;
    }

    // (197:4) {#if adoptMode === 'adopt'}
    function create_if_block_7(ctx) {
    	let adopt;
    	let current;
    	adopt = new Adopt({ $$inline: true });
    	adopt.$on("cancel-adopt", /*hideAdopt*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(adopt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(adopt, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(adopt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(adopt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(adopt, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(197:4) {#if adoptMode === 'adopt'}",
    		ctx
    	});

    	return block;
    }

    // (201:4) {#if checkOutMode === 'checkOut'}
    function create_if_block_6(ctx) {
    	let checkout;
    	let current;
    	checkout = new CheckOut({ $$inline: true });
    	checkout.$on("cancel-checkOut", /*hideCheckOut*/ ctx[18]);

    	const block = {
    		c: function create() {
    			create_component(checkout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkout, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(201:4) {#if checkOutMode === 'checkOut'}",
    		ctx
    	});

    	return block;
    }

    // (205:4) {#if playQuiz === true && goShop === false && feedback === false}
    function create_if_block_5(ctx) {
    	let quiz;
    	let t;
    	let credit;
    	let current;
    	quiz = new Quiz({ $$inline: true });
    	credit = new Credit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(quiz.$$.fragment);
    			t = space();
    			create_component(credit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(quiz, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(credit, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quiz.$$.fragment, local);
    			transition_in(credit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quiz.$$.fragment, local);
    			transition_out(credit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quiz, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(credit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(205:4) {#if playQuiz === true && goShop === false && feedback === false}",
    		ctx
    	});

    	return block;
    }

    // (210:4) {#if feedback === true && playQuiz === false  && goShop === false}
    function create_if_block_4(ctx) {
    	let feedback_1;
    	let current;

    	feedback_1 = new Feedback({
    			props: {
    				feedUser: "Oli",
    				feedComment: "Awesome",
    				numStars: "5"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(feedback_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(feedback_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(feedback_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(feedback_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(feedback_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(210:4) {#if feedback === true && playQuiz === false  && goShop === false}",
    		ctx
    	});

    	return block;
    }

    // (215:4) {#if mainPage === true && playQuiz === false && goShop === false && feedback === false}
    function create_if_block_3(ctx) {
    	let intro;
    	let t;
    	let adoptgrid;
    	let current;

    	intro = new Intro({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	adoptgrid = new AdoptGrid({
    			props: { frogs: /*frogs*/ ctx[10] },
    			$$inline: true
    		});

    	adoptgrid.$on("toggle-favourite", /*toggleFavourite*/ ctx[14]);
    	adoptgrid.$on("adopt-event", /*showAdopt*/ ctx[16]);

    	const block = {
    		c: function create() {
    			create_component(intro.$$.fragment);
    			t = space();
    			create_component(adoptgrid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(intro, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(adoptgrid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const intro_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				intro_changes.$$scope = { dirty, ctx };
    			}

    			intro.$set(intro_changes);
    			const adoptgrid_changes = {};
    			if (dirty & /*frogs*/ 1024) adoptgrid_changes.frogs = /*frogs*/ ctx[10];
    			adoptgrid.$set(adoptgrid_changes);
    		},
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(intro.$$.fragment, local);
    			transition_in(adoptgrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intro.$$.fragment, local);
    			transition_out(adoptgrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(intro, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(adoptgrid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(215:4) {#if mainPage === true && playQuiz === false && goShop === false && feedback === false}",
    		ctx
    	});

    	return block;
    }

    // (216:4) <Intro>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("\"Don't be a fish; be a frog. Swim in the water and jump when you hit ground\" - Kim Young-ha");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(216:4) <Intro>",
    		ctx
    	});

    	return block;
    }

    // (220:4) {#if aboutPage === true}
    function create_if_block_2(ctx) {
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(220:4) {#if aboutPage === true}",
    		ctx
    	});

    	return block;
    }

    // (224:4) {#if goShop === true && playQuiz === false}
    function create_if_block(ctx) {
    	let div;
    	let custombutton0;
    	let t0;
    	let custombutton1;
    	let t1;
    	let t2;
    	let products;
    	let current;

    	custombutton0 = new CustomButton({
    			props: {
    				stateColour: /*$darkModeOn*/ ctx[11]
    				? "secondary-dark"
    				: "secondary-light",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*click_handler_6*/ ctx[27]);

    	custombutton1 = new CustomButton({
    			props: {
    				stateColour: /*$darkModeOn*/ ctx[11]
    				? "secondary-dark"
    				: "secondary-light",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*showCheckOut*/ ctx[17]);
    	let if_block = /*showCart*/ ctx[4] && create_if_block_1(ctx);
    	products = new Products({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(custombutton0.$$.fragment);
    			t0 = space();
    			create_component(custombutton1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(products.$$.fragment);
    			attr_dev(div, "class", "toggle svelte-xcedx7");
    			add_location(div, file, 224, 4, 7093);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(custombutton0, div, null);
    			append_dev(div, t0);
    			mount_component(custombutton1, div, null);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(products, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custombutton0_changes = {};

    			if (dirty & /*$darkModeOn*/ 2048) custombutton0_changes.stateColour = /*$darkModeOn*/ ctx[11]
    			? "secondary-dark"
    			: "secondary-light";

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$darkModeOn*/ 2048) custombutton1_changes.stateColour = /*$darkModeOn*/ ctx[11]
    			? "secondary-dark"
    			: "secondary-light";

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);

    			if (/*showCart*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showCart*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t2.parentNode, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(custombutton0.$$.fragment, local);
    			transition_in(custombutton1.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(products.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton0.$$.fragment, local);
    			transition_out(custombutton1.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(products.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(custombutton0);
    			destroy_component(custombutton1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(products, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(224:4) {#if goShop === true && playQuiz === false}",
    		ctx
    	});

    	return block;
    }

    // (226:4) <CustomButton stateColour={$darkModeOn ? "secondary-dark" : "secondary-light"} on:click={() => {showCart = !showCart;}}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Toggle Cart");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(226:4) <CustomButton stateColour={$darkModeOn ? \\\"secondary-dark\\\" : \\\"secondary-light\\\"} on:click={() => {showCart = !showCart;}}>",
    		ctx
    	});

    	return block;
    }

    // (229:4) <CustomButton stateColour={$darkModeOn ? "secondary-dark" : "secondary-light"} on:click="{showCheckOut}">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("CheckOut");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(229:4) <CustomButton stateColour={$darkModeOn ? \\\"secondary-dark\\\" : \\\"secondary-light\\\"} on:click=\\\"{showCheckOut}\\\">",
    		ctx
    	});

    	return block;
    }

    // (231:4) {#if showCart}
    function create_if_block_1(ctx) {
    	let cart;
    	let current;

    	cart = new Cart({
    			props: { total: /*$total*/ ctx[12] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cart_changes = {};
    			if (dirty & /*$total*/ 4096) cart_changes.total = /*$total*/ ctx[12];
    			cart.$set(cart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(231:4) {#if showCart}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let header;
    	let t0;
    	let main;
    	let div0;
    	let custombutton0;
    	let t1;
    	let custombutton1;
    	let t2;
    	let custombutton2;
    	let t3;
    	let custombutton3;
    	let t4;
    	let custombutton4;
    	let t5;
    	let custombutton5;
    	let t6;
    	let toggle;
    	let updating_toggled;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let footer;
    	let div1_class_value;
    	let current;
    	header = new Header({ $$inline: true });

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*click_handler*/ ctx[20]);

    	custombutton1 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*click_handler_1*/ ctx[21]);

    	custombutton2 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton2.$on("click", /*click_handler_2*/ ctx[22]);

    	custombutton3 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton3.$on("click", /*click_handler_3*/ ctx[23]);

    	custombutton4 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton4.$on("click", /*click_handler_4*/ ctx[24]);

    	custombutton5 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton5.$on("click", /*click_handler_5*/ ctx[25]);

    	function toggle_toggled_binding(value) {
    		/*toggle_toggled_binding*/ ctx[26](value);
    	}

    	let toggle_props = { hideLabel: true, label: "Custom label" };

    	if (/*toggled*/ ctx[0] !== void 0) {
    		toggle_props.toggled = /*toggled*/ ctx[0];
    	}

    	toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind(toggle, "toggled", toggle_toggled_binding));
    	let if_block0 = /*editMode*/ ctx[5] === "add" && create_if_block_8(ctx);
    	let if_block1 = /*adoptMode*/ ctx[6] === "adopt" && create_if_block_7(ctx);
    	let if_block2 = /*checkOutMode*/ ctx[7] === "checkOut" && create_if_block_6(ctx);
    	let if_block3 = /*playQuiz*/ ctx[2] === true && /*goShop*/ ctx[3] === false && /*feedback*/ ctx[9] === false && create_if_block_5(ctx);
    	let if_block4 = /*feedback*/ ctx[9] === true && /*playQuiz*/ ctx[2] === false && /*goShop*/ ctx[3] === false && create_if_block_4(ctx);
    	let if_block5 = /*mainPage*/ ctx[1] === true && /*playQuiz*/ ctx[2] === false && /*goShop*/ ctx[3] === false && /*feedback*/ ctx[9] === false && create_if_block_3(ctx);
    	let if_block6 = /*aboutPage*/ ctx[8] === true && create_if_block_2(ctx);
    	let if_block7 = /*goShop*/ ctx[3] === true && /*playQuiz*/ ctx[2] === false && create_if_block(ctx);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div0 = element("div");
    			create_component(custombutton0.$$.fragment);
    			t1 = space();
    			create_component(custombutton1.$$.fragment);
    			t2 = space();
    			create_component(custombutton2.$$.fragment);
    			t3 = space();
    			create_component(custombutton3.$$.fragment);
    			t4 = space();
    			create_component(custombutton4.$$.fragment);
    			t5 = space();
    			create_component(custombutton5.$$.fragment);
    			t6 = space();
    			create_component(toggle.$$.fragment);
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			if (if_block2) if_block2.c();
    			t10 = space();
    			if (if_block3) if_block3.c();
    			t11 = space();
    			if (if_block4) if_block4.c();
    			t12 = space();
    			if (if_block5) if_block5.c();
    			t13 = space();
    			if (if_block6) if_block6.c();
    			t14 = space();
    			if (if_block7) if_block7.c();
    			t15 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "formControl svelte-xcedx7");
    			add_location(div0, file, 181, 4, 5114);
    			attr_dev(main, "class", "svelte-xcedx7");
    			add_location(main, file, 180, 0, 5103);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[11] ? "darkMode" : "lightMode") + " svelte-xcedx7"));
    			add_location(div1, file, 178, 0, 5040);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(header, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, main);
    			append_dev(main, div0);
    			mount_component(custombutton0, div0, null);
    			append_dev(div0, t1);
    			mount_component(custombutton1, div0, null);
    			append_dev(div0, t2);
    			mount_component(custombutton2, div0, null);
    			append_dev(div0, t3);
    			mount_component(custombutton3, div0, null);
    			append_dev(div0, t4);
    			mount_component(custombutton4, div0, null);
    			append_dev(div0, t5);
    			mount_component(custombutton5, div0, null);
    			append_dev(div0, t6);
    			mount_component(toggle, div0, null);
    			append_dev(main, t7);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t8);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t9);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t10);
    			if (if_block3) if_block3.m(main, null);
    			append_dev(main, t11);
    			if (if_block4) if_block4.m(main, null);
    			append_dev(main, t12);
    			if (if_block5) if_block5.m(main, null);
    			append_dev(main, t13);
    			if (if_block6) if_block6.m(main, null);
    			append_dev(main, t14);
    			if (if_block7) if_block7.m(main, null);
    			append_dev(main, t15);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const custombutton0_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);
    			const custombutton2_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton2_changes.$$scope = { dirty, ctx };
    			}

    			custombutton2.$set(custombutton2_changes);
    			const custombutton3_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton3_changes.$$scope = { dirty, ctx };
    			}

    			custombutton3.$set(custombutton3_changes);
    			const custombutton4_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton4_changes.$$scope = { dirty, ctx };
    			}

    			custombutton4.$set(custombutton4_changes);
    			const custombutton5_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				custombutton5_changes.$$scope = { dirty, ctx };
    			}

    			custombutton5.$set(custombutton5_changes);
    			const toggle_changes = {};

    			if (!updating_toggled && dirty & /*toggled*/ 1) {
    				updating_toggled = true;
    				toggle_changes.toggled = /*toggled*/ ctx[0];
    				add_flush_callback(() => updating_toggled = false);
    			}

    			toggle.$set(toggle_changes);

    			if (/*editMode*/ ctx[5] === "add") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*editMode*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t8);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*adoptMode*/ ctx[6] === "adopt") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*adoptMode*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, t9);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*checkOutMode*/ ctx[7] === "checkOut") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*checkOutMode*/ 128) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_6(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(main, t10);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*playQuiz*/ ctx[2] === true && /*goShop*/ ctx[3] === false && /*feedback*/ ctx[9] === false) {
    				if (if_block3) {
    					if (dirty & /*playQuiz, goShop, feedback*/ 524) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_5(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(main, t11);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*feedback*/ ctx[9] === true && /*playQuiz*/ ctx[2] === false && /*goShop*/ ctx[3] === false) {
    				if (if_block4) {
    					if (dirty & /*feedback, playQuiz, goShop*/ 524) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_4(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(main, t12);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*mainPage*/ ctx[1] === true && /*playQuiz*/ ctx[2] === false && /*goShop*/ ctx[3] === false && /*feedback*/ ctx[9] === false) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty & /*mainPage, playQuiz, goShop, feedback*/ 526) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_3(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(main, t13);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (/*aboutPage*/ ctx[8] === true) {
    				if (if_block6) {
    					if (dirty & /*aboutPage*/ 256) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_2(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(main, t14);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			if (/*goShop*/ ctx[3] === true && /*playQuiz*/ ctx[2] === false) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);

    					if (dirty & /*goShop, playQuiz*/ 12) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(main, t15);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$darkModeOn*/ 2048 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*$darkModeOn*/ ctx[11] ? "darkMode" : "lightMode") + " svelte-xcedx7"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(custombutton0.$$.fragment, local);
    			transition_in(custombutton1.$$.fragment, local);
    			transition_in(custombutton2.$$.fragment, local);
    			transition_in(custombutton3.$$.fragment, local);
    			transition_in(custombutton4.$$.fragment, local);
    			transition_in(custombutton5.$$.fragment, local);
    			transition_in(toggle.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(custombutton0.$$.fragment, local);
    			transition_out(custombutton1.$$.fragment, local);
    			transition_out(custombutton2.$$.fragment, local);
    			transition_out(custombutton3.$$.fragment, local);
    			transition_out(custombutton4.$$.fragment, local);
    			transition_out(custombutton5.$$.fragment, local);
    			transition_out(toggle.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(header);
    			destroy_component(custombutton0);
    			destroy_component(custombutton1);
    			destroy_component(custombutton2);
    			destroy_component(custombutton3);
    			destroy_component(custombutton4);
    			destroy_component(custombutton5);
    			destroy_component(toggle);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $darkModeOn;
    	let $total;
    	validate_store(darkModeOn, "darkModeOn");
    	component_subscribe($$self, darkModeOn, $$value => $$invalidate(11, $darkModeOn = $$value));
    	validate_store(total, "total");
    	component_subscribe($$self, total, $$value => $$invalidate(12, $total = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let toggled = false;
    	let mainPage = true;
    	let playQuiz = false;
    	let goShop = false;
    	let showCart = true;
    	let editMode = null;
    	let adoptMode = null;
    	let checkOutMode = null;
    	let aboutPage = false;
    	let feedback = false;

    	let frogs = [
    		{
    			id: "1sp",
    			title: "Gerald",
    			subtitle: "White's Tree frog",
    			description: "Gerald is a very polite frog and needs a home and someone to love him",
    			imageUrl: "https://www.reptilecentre.com/sites/Reptile/img/category-header/white-tree-frog-care.jpg",
    			address: "34 Blackstock road, Stockwell, SW9 S3T, London",
    			contact: "svelteLondonSoc@gmail.com",
    			isFavourite: false
    		},
    		{
    			id: "1bg",
    			title: "Maurice and Natalie",
    			subtitle: "Green Tree frogs",
    			description: "Two lovely frogs that are looking for new owners, well behaved and easy to clean up after",
    			imageUrl: "https://images.creativemarket.com/0.1.0/ps/4367698/1820/1208/m1/fpnw/wm1/rr5eyoggepciup7ilsiqxibka6y9tb02uccxj2ll7df6bmzr81mftor1bogxhnyr-.jpg?1524810279&s=47f7a973b02514e15513039a4f16eb31",
    			address: "321 Seven sisters road, Finsbury Park, N17 4FA, London",
    			contact: "svelteLondonSoc@gmail.com",
    			isFavourite: false
    		},
    		{
    			id: "1rt",
    			title: "Arnold",
    			subtitle: "African clawed frog",
    			description: "Somewhat strange but fiercely loyal, Arnold hasn't had the easiest life, it's time to give him a chance",
    			imageUrl: "https://www.aqualog.de/wp-content/uploads/2017/08/xenopus-albino2.jpg",
    			address: "11 Regents Street, C12 WEB, London",
    			contact: "svelteLondonSoc@gmail.com",
    			isFavourite: false
    		},
    		{
    			id: "1an",
    			title: "Rosie",
    			subtitle: "Dart frog",
    			description: "Deceivingly clever and not to be messed with, rosie was rescued from an eccentric drug dealer and full time party person. She now needs to peace and quiet. ",
    			imageUrl: "https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F28638272-6943-11ea-b96a-000a4e1a8b0c.jpg?crop=3959%2C2639%2C0%2C0",
    			address: "321 Seven sisters road, Finsbury Park, N17 4FA, London",
    			contact: "svelteLondonSoc@gmail.com",
    			isFavourite: false
    		}
    	];

    	function addFrog(event) {
    		const newFrog = {
    			id: Math.random().toString() + "ua",
    			title: event.detail.title,
    			subtitle: event.detail.subtitle,
    			description: event.detail.description,
    			imageUrl: event.detail.imageUrl,
    			address: event.detail.address,
    			contact: event.detail.contact
    		};

    		if (title != "" && subtitle != "") {
    			// nice modern JS syntax for adding items to list
    			$$invalidate(10, frogs = [newFrog, ...frogs]);
    		}

    		$$invalidate(5, editMode = null);
    	}

    	function toggleFavourite(event) {
    		const id = event.detail;

    		//find is a new piece of modern JS
    		const updatedFrog = { ...frogs.find(m => m.id === id) };

    		updatedFrog.isFavourite = !updatedFrog.isFavourite;
    		const frogIndex = frogs.findIndex(m => m.id === id);
    		const updatedFrogs = [...frogs];
    		updatedFrogs[frogIndex] = updatedFrog;
    		$$invalidate(10, frogs = updatedFrogs);
    	}

    	function cancelForm(event) {
    		$$invalidate(5, editMode = "null");
    	}

    	function showAdopt(event) {
    		$$invalidate(6, adoptMode = "adopt");
    	}

    	function showCheckOut() {
    		$$invalidate(7, checkOutMode = "checkOut");
    	}

    	function hideCheckOut(event) {
    		$$invalidate(7, checkOutMode = null);
    	}

    	function hideAdopt(event) {
    		$$invalidate(6, adoptMode = null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, mainPage = true);
    		$$invalidate(8, aboutPage = false);
    		$$invalidate(2, playQuiz = false);
    		$$invalidate(3, goShop = false);
    		$$invalidate(9, feedback = false);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(8, aboutPage = true);
    		$$invalidate(1, mainPage = false);
    		$$invalidate(2, playQuiz = false);
    		$$invalidate(3, goShop = false);
    		$$invalidate(9, feedback = false);
    	};

    	const click_handler_2 = () => $$invalidate(5, editMode = "add");

    	const click_handler_3 = () => {
    		$$invalidate(2, playQuiz = true);
    		$$invalidate(8, aboutPage = false);
    		$$invalidate(3, goShop = false);
    		$$invalidate(9, feedback = false);
    	};

    	const click_handler_4 = () => {
    		$$invalidate(3, goShop = true);
    		$$invalidate(8, aboutPage = false);
    		$$invalidate(2, playQuiz = false);
    		$$invalidate(9, feedback = false);
    	};

    	const click_handler_5 = () => {
    		$$invalidate(9, feedback = true);
    		$$invalidate(1, mainPage = false);
    		$$invalidate(3, goShop = false);
    		$$invalidate(8, aboutPage = false);
    		$$invalidate(2, playQuiz = false);
    	};

    	function toggle_toggled_binding(value) {
    		toggled = value;
    		$$invalidate(0, toggled);
    	}

    	const click_handler_6 = () => {
    		$$invalidate(4, showCart = !showCart);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		AdoptGrid,
    		CustomButton,
    		EditAdopt,
    		Adopt,
    		Intro,
    		Quiz,
    		Footer,
    		About,
    		Cart,
    		CheckOut,
    		Products,
    		Feedback,
    		Credit,
    		total,
    		darkModeOn,
    		Toggle,
    		toggled,
    		mainPage,
    		playQuiz,
    		goShop,
    		showCart,
    		editMode,
    		adoptMode,
    		checkOutMode,
    		aboutPage,
    		feedback,
    		frogs,
    		addFrog,
    		toggleFavourite,
    		cancelForm,
    		showAdopt,
    		showCheckOut,
    		hideCheckOut,
    		hideAdopt,
    		$darkModeOn,
    		$total
    	});

    	$$self.$inject_state = $$props => {
    		if ("toggled" in $$props) $$invalidate(0, toggled = $$props.toggled);
    		if ("mainPage" in $$props) $$invalidate(1, mainPage = $$props.mainPage);
    		if ("playQuiz" in $$props) $$invalidate(2, playQuiz = $$props.playQuiz);
    		if ("goShop" in $$props) $$invalidate(3, goShop = $$props.goShop);
    		if ("showCart" in $$props) $$invalidate(4, showCart = $$props.showCart);
    		if ("editMode" in $$props) $$invalidate(5, editMode = $$props.editMode);
    		if ("adoptMode" in $$props) $$invalidate(6, adoptMode = $$props.adoptMode);
    		if ("checkOutMode" in $$props) $$invalidate(7, checkOutMode = $$props.checkOutMode);
    		if ("aboutPage" in $$props) $$invalidate(8, aboutPage = $$props.aboutPage);
    		if ("feedback" in $$props) $$invalidate(9, feedback = $$props.feedback);
    		if ("frogs" in $$props) $$invalidate(10, frogs = $$props.frogs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toggled*/ 1) {
    			if (toggled === true) {
    				darkModeOn.set(toggled);
    			}
    		}

    		if ($$self.$$.dirty & /*toggled*/ 1) {
    			if (toggled === false) {
    				darkModeOn.set(toggled);
    			}
    		}
    	};

    	return [
    		toggled,
    		mainPage,
    		playQuiz,
    		goShop,
    		showCart,
    		editMode,
    		adoptMode,
    		checkOutMode,
    		aboutPage,
    		feedback,
    		frogs,
    		$darkModeOn,
    		$total,
    		addFrog,
    		toggleFavourite,
    		cancelForm,
    		showAdopt,
    		showCheckOut,
    		hideCheckOut,
    		hideAdopt,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		toggle_toggled_binding,
    		click_handler_6
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
