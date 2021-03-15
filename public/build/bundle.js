
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

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
    function children(element) {
        return Array.from(element.childNodes);
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
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
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
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
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
            update: noop,
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
            this.$destroy = noop;
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
    const file$k = "src/UI/Header.svelte";

    function create_fragment$k(ctx) {
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
    			attr_dev(h1, "class", "wiggle svelte-1rl11nn");
    			add_location(h1, file$k, 47, 4, 864);
    			if (img.src !== (img_src_value = "https://www.flaticon.com/svg/vstatic/svg/424/424870.svg?token=exp=1615249621~hmac=e98a24b849aff33ebde9abf8fec9421d")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "frog");
    			attr_dev(img, "width", "60rem");
    			attr_dev(img, "class", "svelte-1rl11nn");
    			add_location(img, file$k, 48, 4, 905);
    			attr_dev(header, "class", "svelte-1rl11nn");
    			add_location(header, file$k, 46, 0, 851);
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
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/UI/Social.svelte generated by Svelte v3.35.0 */
    const file$j = "src/UI/Social.svelte";

    function create_fragment$j(ctx) {
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
    			if (img.src !== (img_src_value = "https://www.flaticon.com/svg/vstatic/svg/424/424870.svg?token=exp=1615249621~hmac=e98a24b849aff33ebde9abf8fec9421d")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "frog");
    			attr_dev(img, "width", "40rem");
    			add_location(img, file$j, 35, 13, 639);
    			add_location(span, file$j, 35, 7, 633);
    			attr_dev(p, "class", "svelte-4vhr8g");
    			add_location(p, file$j, 35, 4, 630);
    			button.disabled = /*disabled*/ ctx[1];
    			attr_dev(button, "class", "svelte-4vhr8g");
    			add_location(button, file$j, 36, 4, 819);
    			add_location(div, file$j, 34, 0, 620);
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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { counterName: 0, disabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Social",
    			options,
    			id: create_fragment$j.name
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

    const file$i = "src/UI/CustomButton.svelte";

    function create_fragment$i(ctx) {
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
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*stateColour*/ ctx[1]) + " svelte-1s3ueu3"));
    			attr_dev(button, "type", /*btntype*/ ctx[0]);
    			button.disabled = /*disabled*/ ctx[2];
    			add_location(button, file$i, 95, 0, 1500);
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

    			if (!current || dirty & /*stateColour*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*stateColour*/ ctx[1]) + " svelte-1s3ueu3"))) {
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { btntype: 0, stateColour: 1, disabled: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomButton",
    			options,
    			id: create_fragment$i.name
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
    const file$h = "src/UI/Badge.svelte";

    function create_fragment$h(ctx) {
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
    			add_location(span, file$h, 17, 0, 331);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Badge",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/Adoption/AdoptItem.svelte generated by Svelte v3.35.0 */

    const { Error: Error_1$1, Object: Object_1, console: console_1$1 } = globals;
    const file$g = "src/Adoption/AdoptItem.svelte";

    // (158:6) {#if isFavItem}
    function create_if_block$6(ctx) {
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(158:6) {#if isFavItem}",
    		ctx
    	});

    	return block;
    }

    // (159:8) <Badge>
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
    		source: "(159:8) <Badge>",
    		ctx
    	});

    	return block;
    }

    // (167:8) <CustomButton on:click={() => dispatch('adopt-event')} btntype="submit">
    function create_default_slot_1$5(ctx) {
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
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(167:8) <CustomButton on:click={() => dispatch('adopt-event')} btntype=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (168:8) <CustomButton on:click={() => dispatch('toggle-favourite', id)} btntype="submit" stateColour="{isFavItem ? null : "success"}">
    function create_default_slot$8(ctx) {
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
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(168:8) <CustomButton on:click={() => dispatch('toggle-favourite', id)} btntype=\\\"submit\\\" stateColour=\\\"{isFavItem ? null : \\\"success\\\"}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
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
    	let article_intro;
    	let current;
    	let if_block = /*isFavItem*/ ctx[7] && create_if_block$6(ctx);

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*click_handler*/ ctx[13]);

    	custombutton1 = new CustomButton({
    			props: {
    				btntype: "submit",
    				stateColour: /*isFavItem*/ ctx[7] ? null : "success",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*click_handler_1*/ ctx[14]);

    	social = new Social({
    			props: {
    				disabled: /*disabled*/ ctx[9],
    				counterName: "Likes " + /*likes*/ ctx[8]
    			},
    			$$inline: true
    		});

    	social.$on("pass-up-data", /*saveLikesFb*/ ctx[12]);
    	social.$on("pass-up-data", /*captureCustomEventData*/ ctx[11]);

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
    			attr_dev(h1, "class", "svelte-mj1ygn");
    			add_location(h1, file$g, 148, 8, 2839);
    			attr_dev(h2, "class", "svelte-mj1ygn");
    			add_location(h2, file$g, 150, 8, 2873);
    			attr_dev(p0, "class", "svelte-mj1ygn");
    			add_location(p0, file$g, 151, 8, 2901);
    			attr_dev(header, "class", "svelte-mj1ygn");
    			add_location(header, file$g, 147, 4, 2822);
    			if (img.src !== (img_src_value = /*imageUrl*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-mj1ygn");
    			add_location(img, file$g, 154, 8, 2974);
    			attr_dev(div0, "class", "image svelte-mj1ygn");
    			add_location(div0, file$g, 153, 4, 2946);
    			attr_dev(div1, "class", "badge svelte-mj1ygn");
    			add_location(div1, file$g, 156, 4, 3020);
    			attr_dev(p1, "class", "svelte-mj1ygn");
    			add_location(p1, file$g, 162, 8, 3163);
    			attr_dev(div2, "class", "content svelte-mj1ygn");
    			add_location(div2, file$g, 161, 4, 3133);
    			attr_dev(a, "href", a_href_value = "mailto:" + /*email*/ ctx[6]);
    			add_location(a, file$g, 165, 8, 3216);
    			attr_dev(footer, "class", "svelte-mj1ygn");
    			add_location(footer, file$g, 164, 4, 3199);
    			attr_dev(article, "class", "svelte-mj1ygn");
    			add_location(article, file$g, 146, 0, 2800);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    					if_block = create_if_block$6(ctx);
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

    			if (dirty & /*$$scope*/ 131072) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};
    			if (dirty & /*isFavItem*/ 128) custombutton1_changes.stateColour = /*isFavItem*/ ctx[7] ? null : "success";

    			if (dirty & /*$$scope, isFavItem*/ 131200) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);
    			const social_changes = {};
    			if (dirty & /*disabled*/ 512) social_changes.disabled = /*disabled*/ ctx[9];
    			if (dirty & /*likes*/ 256) social_changes.counterName = "Likes " + /*likes*/ ctx[8];
    			social.$set(social_changes);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    				throw new Error("Post request failed");
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

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<AdoptItem> was created with unknown prop '${key}'`);
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
    		saveLikesFb
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

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
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
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'id'");
    		}

    		if (/*title*/ ctx[1] === undefined && !("title" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'title'");
    		}

    		if (/*subtitle*/ ctx[2] === undefined && !("subtitle" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'subtitle'");
    		}

    		if (/*imageUrl*/ ctx[3] === undefined && !("imageUrl" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'imageUrl'");
    		}

    		if (/*description*/ ctx[4] === undefined && !("description" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'description'");
    		}

    		if (/*address*/ ctx[5] === undefined && !("address" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'address'");
    		}

    		if (/*email*/ ctx[6] === undefined && !("email" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'email'");
    		}

    		if (/*isFavItem*/ ctx[7] === undefined && !("isFavItem" in props)) {
    			console_1$1.warn("<AdoptItem> was created without expected prop 'isFavItem'");
    		}
    	}

    	get id() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageUrl() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageUrl(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get address() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set address(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFavItem() {
    		throw new Error_1$1("<AdoptItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFavItem(value) {
    		throw new Error_1$1("<AdoptItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Adoption/AdoptGrid.svelte generated by Svelte v3.35.0 */
    const file$f = "src/Adoption/AdoptGrid.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (23:4) {#each frogs as frog}
    function create_each_block$4(ctx) {
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(23:4) {#each frogs as frog}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let section;
    	let current;
    	let each_value = /*frogs*/ ctx[0];
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
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "id", "frogs");
    			attr_dev(section, "class", "svelte-en9a7l");
    			add_location(section, file$f, 21, 0, 290);
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
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { frogs: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdoptGrid",
    			options,
    			id: create_fragment$f.name
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

    const file$e = "src/UI/TextInput.svelte";

    // (68:0) {:else}
    function create_else_block$3(ctx) {
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
    			add_location(input, file$e, 68, 4, 1234);
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(68:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:0) {#if controlType === "textarea"}
    function create_if_block_1$3(ctx) {
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
    			add_location(textarea, file$e, 66, 4, 1115);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(63:0) {#if controlType === \\\"textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if validityMessage && !valid}
    function create_if_block$5(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*validityMessage*/ ctx[6]);
    			attr_dev(p, "class", "error-message svelte-8lwa8w");
    			add_location(p, file$e, 71, 0, 1351);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(71:0) {#if validityMessage && !valid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let label_1;
    	let t0;
    	let t1;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (/*controlType*/ ctx[0] === "textarea") return create_if_block_1$3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*validityMessage*/ ctx[6] && !/*valid*/ ctx[5] && create_if_block$5(ctx);

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
    			add_location(label_1, file$e, 61, 4, 882);
    			attr_dev(div, "class", "form-control svelte-8lwa8w");
    			add_location(div, file$e, 60, 0, 851);
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
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
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

    function instance$e($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
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
    			id: create_fragment$e.name
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
    const file$d = "src/UI/Modal.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    // (72:6) <CustomButton on:click="{closeModel}">
    function create_default_slot$7(ctx) {
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
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(72:6) <CustomButton on:click=\\\"{closeModel}\\\">",
    		ctx
    	});

    	return block;
    }

    // (71:24)        
    function fallback_block(ctx) {
    	let custombutton;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
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
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(71:24)        ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
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
    	const footer_slot_or_fallback = footer_slot || fallback_block(ctx);

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
    			attr_dev(div0, "class", "modal-backdrop svelte-pii6by");
    			add_location(div0, file$d, 63, 0, 999);
    			attr_dev(h1, "class", "svelte-pii6by");
    			add_location(h1, file$d, 65, 4, 1120);
    			attr_dev(div1, "class", "content svelte-pii6by");
    			add_location(div1, file$d, 66, 4, 1141);
    			attr_dev(footer, "class", "svelte-pii6by");
    			add_location(footer, file$d, 69, 4, 1195);
    			attr_dev(div2, "class", "modal svelte-pii6by");
    			add_location(div2, file$d, 64, 0, 1069);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$d.name
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

    const { console: console_1 } = globals;
    const file$c = "src/Adoption/EditAdopt.svelte";

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
    			add_location(form, file$c, 52, 4, 1150);
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
    function create_default_slot_1$4(ctx) {
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
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(109:8) <CustomButton btntype=\\\"submit\\\" disabled={!overallValid} on:click=\\\"{submitForm}\\\" on:click={console.log(overallValid)}>",
    		ctx
    	});

    	return block;
    }

    // (110:8) <CustomButton btntype="button" on:click="{cancel}">
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
    		source: "(110:8) <CustomButton btntype=\\\"button\\\" on:click=\\\"{cancel}\\\">",
    		ctx
    	});

    	return block;
    }

    // (108:4) 
    function create_footer_slot$2(ctx) {
    	let div;
    	let custombutton0;
    	let t;
    	let custombutton1;
    	let current;

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				disabled: !/*overallValid*/ ctx[9],
    				$$slots: { default: [create_default_slot_1$4] },
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
    				$$slots: { default: [create_default_slot$6] },
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
    			add_location(div, file$c, 107, 4, 2584);
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
    		id: create_footer_slot$2.name,
    		type: "slot",
    		source: "(108:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Re-home Form",
    				$$slots: {
    					footer: [create_footer_slot$2],
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<EditAdopt> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditAdopt",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/Adoption/Adopt.svelte generated by Svelte v3.35.0 */
    const file$b = "src/Adoption/Adopt.svelte";

    // (21:4) <Modal title="Adopting a frog" on:cancel>
    function create_default_slot_2$1(ctx) {
    	let form;
    	let form_intro;

    	const block = {
    		c: function create() {
    			form = element("form");
    			attr_dev(form, "class", "svelte-xg754s");
    			add_location(form, file$b, 21, 4, 415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    		},
    		i: function intro(local) {
    			if (!form_intro) {
    				add_render_callback(() => {
    					form_intro = create_in_transition(form, fade, {});
    					form_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(21:4) <Modal title=\\\"Adopting a frog\\\" on:cancel>",
    		ctx
    	});

    	return block;
    }

    // (26:8) <CustomButton btntype="submit" >
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Next Steps!");
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
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(26:8) <CustomButton btntype=\\\"submit\\\" >",
    		ctx
    	});

    	return block;
    }

    // (27:8) <CustomButton btntype="button" on:click="{cancel}">
    function create_default_slot$5(ctx) {
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
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(27:8) <CustomButton btntype=\\\"button\\\" on:click=\\\"{cancel}\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:4) 
    function create_footer_slot$1(ctx) {
    	let div;
    	let custombutton0;
    	let t;
    	let custombutton1;
    	let current;

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1 = new CustomButton({
    			props: {
    				btntype: "button",
    				$$slots: { default: [create_default_slot$5] },
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
    			add_location(div, file$b, 24, 4, 451);
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

    			if (dirty & /*$$scope*/ 8) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
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
    		id: create_footer_slot$1.name,
    		type: "slot",
    		source: "(25:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Adopting a frog",
    				$$slots: {
    					footer: [create_footer_slot$1],
    					default: [create_default_slot_2$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("cancel", /*cancel_handler*/ ctx[1]);

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

    			if (dirty & /*$$scope*/ 8) {
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Adopt", slots, []);
    	const dispatch = createEventDispatcher();

    	function cancel() {
    		dispatch("cancel-adopt");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Adopt> was created with unknown prop '${key}'`);
    	});

    	function cancel_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$capture_state = () => ({
    		fade,
    		createEventDispatcher,
    		CustomButton,
    		Modal,
    		dispatch,
    		cancel
    	});

    	return [cancel, cancel_handler];
    }

    class Adopt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Adopt",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/UI/Intro.svelte generated by Svelte v3.35.0 */

    const { Error: Error_1 } = globals;
    const file$a = "src/UI/Intro.svelte";

    // (47:4) {#if visible}
    function create_if_block$4(ctx) {
    	let h2;
    	let h2_intro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			attr_dev(h2, "class", "svelte-6b1fre");
    			add_location(h2, file$a, 47, 4, 1010);
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
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(47:4) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let blockquote;
    	let current;
    	let if_block = /*visible*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			if (if_block) if_block.c();
    			add_location(blockquote, file$a, 45, 0, 975);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    					if_block = create_if_block$4(ctx);
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
    		id: create_fragment$a.name,
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

    function instance$a($$self, $$props, $$invalidate) {
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
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, visible, typewriter });

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [visible, $$scope, slots];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Quiz/Question.svelte generated by Svelte v3.35.0 */

    const file$9 = "src/Quiz/Question.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (71:0) {#if isAnswered}
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
    			add_location(h5, file$9, 71, 2, 1050);
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
    		source: "(71:0) {#if isAnswered}",
    		ctx
    	});

    	return block;
    }

    // (73:57) {:else}
    function create_else_block$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Incorrect 😬";
    			attr_dev(span, "class", "wrong svelte-zs9p2");
    			add_location(span, file$9, 72, 64, 1119);
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
    		source: "(73:57) {:else}",
    		ctx
    	});

    	return block;
    }

    // (73:4) {#if isCorrect}
    function create_if_block_2$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Correct! 😃";
    			attr_dev(span, "class", "right svelte-zs9p2");
    			add_location(span, file$9, 72, 19, 1074);
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
    		source: "(73:4) {#if isCorrect}",
    		ctx
    	});

    	return block;
    }

    // (77:0) {#each allAnswers as answer}
    function create_each_block$3(ctx) {
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
    			attr_dev(button, "class", "answerBtn svelte-zs9p2");
    			button.disabled = /*isAnswered*/ ctx[3];
    			add_location(button, file$9, 77, 2, 1210);
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(77:0) {#each allAnswers as answer}",
    		ctx
    	});

    	return block;
    }

    // (83:0) {#if isAnswered}
    function create_if_block$3(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Next Question";
    			add_location(button, file$9, 84, 4, 1382);
    			add_location(div, file$9, 83, 2, 1372);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(83:0) {#if isAnswered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let h3;
    	let raw_value = /*question*/ ctx[0].question + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let footer;
    	let p;
    	let t4;
    	let span;
    	let ul;
    	let em;
    	let a;
    	let if_block0 = /*isAnswered*/ ctx[3] && create_if_block_1$2(ctx);
    	let each_value = /*allAnswers*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	let if_block1 = /*isAnswered*/ ctx[3] && create_if_block$3(ctx);

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
    			t3 = space();
    			footer = element("footer");
    			p = element("p");
    			t4 = text("Questions provided by: ");
    			span = element("span");
    			ul = element("ul");
    			em = element("em");
    			a = element("a");
    			a.textContent = "Open Trivia API";
    			add_location(h3, file$9, 67, 0, 992);
    			attr_dev(a, "href", "https://opentdb.com");
    			add_location(a, file$9, 92, 8, 1525);
    			add_location(em, file$9, 91, 6, 1512);
    			add_location(ul, file$9, 90, 4, 1501);
    			add_location(span, file$9, 89, 28, 1490);
    			attr_dev(p, "class", "svelte-zs9p2");
    			add_location(p, file$9, 89, 2, 1464);
    			add_location(footer, file$9, 88, 0, 1453);
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
    			insert_dev(target, t3, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p);
    			append_dev(p, t4);
    			append_dev(p, span);
    			append_dev(span, ul);
    			append_dev(ul, em);
    			append_dev(em, a);
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
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(footer);
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

    function shuffle(array) {
    	array.sort(() => Math.random() - 0.5);
    }

    function instance$9($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			question: 0,
    			nextQuestion: 1,
    			addToScore: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question",
    			options,
    			id: create_fragment$9.name
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
    const file$8 = "src/Quiz/Quiz.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (65:2) {:else}
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
    		value: 9,
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
    			add_location(h3, file$8, 65, 2, 1196);
    			add_location(h4, file$8, 66, 2, 1225);
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
    				child_ctx[9] = info.resolved;
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
    		source: "(65:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:2) {#if preventRestart === false}
    function create_if_block_1$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start New Quiz";
    			add_location(button, file$8, 63, 2, 1131);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*resetQuiz*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
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
    		source: "(63:2) {#if preventRestart === false}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { fade, blur, fly, slide, scale }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    // (72:2) {:then data}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*data*/ ctx[9].results;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
    			if (dirty & /*addToScore, nextQuestion, quiz, activeQuestion*/ 165) {
    				each_value = /*data*/ ctx[9].results;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		source: "(72:2) {:then data}",
    		ctx
    	});

    	return block;
    }

    // (75:6) {#if index === activeQuestion}
    function create_if_block_2$1(ctx) {
    	let div;
    	let question;
    	let t;
    	let div_intro;
    	let current;

    	question = new Question({
    			props: {
    				addToScore: /*addToScore*/ ctx[7],
    				nextQuestion: /*nextQuestion*/ ctx[5],
    				question: /*question*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(question.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "fade-wrapper svelte-bio06z");
    			add_location(div, file$8, 75, 8, 1406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(question, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const question_changes = {};
    			if (dirty & /*quiz*/ 4) question_changes.question = /*question*/ ctx[10];
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
    		source: "(75:6) {#if index === activeQuestion}",
    		ctx
    	});

    	return block;
    }

    // (74:4) {#each data.results as question, index}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*index*/ ctx[12] === /*activeQuestion*/ ctx[0] && create_if_block_2$1(ctx);

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
    			if (/*index*/ ctx[12] === /*activeQuestion*/ ctx[0]) {
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(74:4) {#each data.results as question, index}",
    		ctx
    	});

    	return block;
    }

    // (70:15)      Loading....   {:then data}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading....");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(70:15)      Loading....   {:then data}",
    		ctx
    	});

    	return block;
    }

    // (85:2) {#if gameOver === true}
    function create_if_block$2(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Game Over",
    				$$slots: {
    					footer: [create_footer_slot],
    					default: [create_default_slot_1$2]
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

    			if (dirty & /*$$scope, score*/ 8194) {
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(85:2) {#if gameOver === true}",
    		ctx
    	});

    	return block;
    }

    // (86:2) <Modal title="Game Over">
    function create_default_slot_1$2(ctx) {
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
    			add_location(h1, file$8, 87, 6, 1633);
    			add_location(div, file$8, 86, 4, 1621);
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(86:2) <Modal title=\\\"Game Over\\\">",
    		ctx
    	});

    	return block;
    }

    // (91:6) <CustomButton btntype="button" on:click="{hideModal}">
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
    		source: "(91:6) <CustomButton btntype=\\\"button\\\" on:click=\\\"{hideModal}\\\">",
    		ctx
    	});

    	return block;
    }

    // (90:4) 
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

    	custombutton.$on("click", /*hideModal*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(custombutton.$$.fragment);
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$8, 89, 4, 1676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(custombutton, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
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
    		source: "(90:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*preventRestart*/ ctx[4] === false) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*gameOver*/ ctx[3] === true && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "question-wrapper svelte-bio06z");
    			add_location(div0, file$8, 61, 0, 1065);
    			attr_dev(div1, "class", "pad svelte-bio06z");
    			add_location(div1, file$8, 95, 0, 1813);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
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
    				if_block0.m(div0, t0);
    			}

    			if (/*gameOver*/ ctx[3] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*gameOver*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
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
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
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

    async function getQuiz() {
    	const res = await fetch("https://opentdb.com/api.php?amount=10&category=27");
    	const quiz = await res.json();
    	return quiz;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		activeQuestion,
    		score,
    		quiz,
    		gameOver,
    		preventRestart,
    		getQuiz,
    		nextQuestion,
    		resetQuiz,
    		addToScore,
    		hideModal
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
    		nextQuestion,
    		resetQuiz,
    		addToScore,
    		hideModal
    	];
    }

    class Quiz extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quiz",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/UI/Footer.svelte generated by Svelte v3.35.0 */

    const file$7 = "src/UI/Footer.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(link, file$7, 17, 4, 211);
    			add_location(head, file$7, 16, 0, 200);
    			add_location(b, file$7, 22, 16, 467);
    			attr_dev(i, "class", "fab fa-github");
    			add_location(i, file$7, 22, 43, 494);
    			add_location(span, file$7, 22, 37, 488);
    			attr_dev(p, "class", "svelte-ajcvzl");
    			add_location(p, file$7, 22, 6, 457);
    			add_location(div, file$7, 21, 4, 445);
    			attr_dev(footer, "class", "info svelte-ajcvzl");
    			add_location(footer, file$7, 20, 2, 419);
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
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(footer);
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

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/UI/About.svelte generated by Svelte v3.35.0 */
    const file$6 = "src/UI/About.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let h4;
    	let t5;
    	let p;
    	let t6;
    	let a0;
    	let t8;
    	let br0;
    	let t9;
    	let br1;
    	let t10;
    	let a1;
    	let t12;
    	let br2;
    	let t13;
    	let br3;
    	let t14;
    	let t15;
    	let div1;
    	let img;
    	let img_src_value;
    	let div2_intro;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hi i'm Oli";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "I'm an aspiring web developer from London";
    			t3 = space();
    			h4 = element("h4");
    			h4.textContent = "My programming ambition is to build web applications that are fast, elegant and enjoyable to use.";
    			t5 = space();
    			p = element("p");
    			t6 = text("Like many others taking a step into coding, I started my programming journey with Python. The first 'proper' project I worked on was a health and lifestyle PyQT desktop application with FitBit data integration. To overcome the limitations of desktop apps, I decided to study the Django web framework and created a ");
    			a0 = element("a");
    			a0.textContent = "fun platform";
    			t8 = text(" for 'glitch art' image processing. It was at that moment that I realised the power and potential of web development and I set on a path to seriously learn modern HTML, CSS and Javascript. \n   ");
    			br0 = element("br");
    			t9 = space();
    			br1 = element("br");
    			t10 = text("\n   After working on a number of personal Javascript projects including an (addictive) ");
    			a1 = element("a");
    			a1.textContent = "Blackjack game";
    			t12 = text(" I now consider Javascript my preferred langauge, and i'm confident and comfortable solving level 5 kata in CodeWars and 'advent of code' challenges using ES6 practices.\n   ");
    			br2 = element("br");
    			t13 = space();
    			br3 = element("br");
    			t14 = text("\n    My current frontend framework of choice is Svelte, it is an excellent tool for building performant Single Page Applications and is the framework that this portfolio was made with! Despite the relative obscurity of Svelte I believe it is a great framework for learning component based architecture as well as state management. The skills I have developed will be transferable to technologies such as React, Angular and Vue.");
    			t15 = space();
    			div1 = element("div");
    			img = element("img");
    			add_location(h1, file$6, 61, 0, 1109);
    			add_location(h2, file$6, 62, 0, 1129);
    			attr_dev(h4, "class", "svelte-12xhqu3");
    			add_location(h4, file$6, 63, 0, 1180);
    			attr_dev(a0, "target", "blank");
    			attr_dev(a0, "href", "https://cyclone.pythonanywhere.com/");
    			add_location(a0, file$6, 66, 317, 1610);
    			add_location(br0, file$6, 67, 3, 1880);
    			add_location(br1, file$6, 68, 3, 1888);
    			attr_dev(a1, "target", "blank");
    			attr_dev(a1, "href", "https://duckrabbitpython.pythonanywhere.com/blackJack");
    			add_location(a1, file$6, 69, 86, 1979);
    			add_location(br2, file$6, 70, 3, 2249);
    			add_location(br3, file$6, 71, 3, 2257);
    			add_location(p, file$6, 66, 0, 1293);
    			attr_dev(div0, "class", "textInfo svelte-12xhqu3");
    			add_location(div0, file$6, 60, 0, 1086);
    			if (img.src !== (img_src_value = "https://lh3.googleusercontent.com/pw/ACtC-3cb-aP7FxlsJshnVGZ1NCOpirBBTlAxygBxiuFzFrWG5W1OvTsctH5GxSgDDaWLrg5giPiuKAdv55pB9874sz-bj78IO-k_DUoTU3sHGKDNutDBs3RL8tbfBsLy1-gmf3TUTJATY75TrVusjmuSeckz=w1124-h1420-no?authuser=0")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "profile");
    			attr_dev(img, "class", "svelte-12xhqu3");
    			add_location(img, file$6, 76, 0, 2727);
    			attr_dev(div1, "class", "profilePic svelte-12xhqu3");
    			add_location(div1, file$6, 75, 0, 2702);
    			attr_dev(div2, "class", "container svelte-12xhqu3");
    			add_location(div2, file$6, 58, 0, 1050);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, h2);
    			append_dev(div0, t3);
    			append_dev(div0, h4);
    			append_dev(div0, t5);
    			append_dev(div0, p);
    			append_dev(p, t6);
    			append_dev(p, a0);
    			append_dev(p, t8);
    			append_dev(p, br0);
    			append_dev(p, t9);
    			append_dev(p, br1);
    			append_dev(p, t10);
    			append_dev(p, a1);
    			append_dev(p, t12);
    			append_dev(p, br2);
    			append_dev(p, t13);
    			append_dev(p, br3);
    			append_dev(p, t14);
    			append_dev(div2, t15);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, fly, {});
    					div2_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade, fly });
    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
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
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
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

    const cart = writable([
      {
        id: 's8',
        title: 'Frog wallpaper download',
        price: 'FREE'
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
      }
    };

    const products = writable([
      {
        id: 'p1',
        title: 'Frog T-shirt',
        price: '£25.00',
        description: 'Available in all sizes',
        srcVar: 'https://cdn.shopify.com/s/files/1/1649/6313/products/PPFGTS-GR-NTmain_530x@2x.jpg?v=1558683409'
      },
      {
        id: 'p2',
        title: 'Frog Mug',
        price: '£6.00',
        description: "Sweeeeeeeeet frog mug. BUY IT",
        srcVar: 'https://img.ltwebstatic.com/images3_pi/2020/12/03/160697495119c005d9d00195e053fdf06c4c7ae50d_thumbnail_900x.webp'
      },
      {
        id: 'p3',
        title: 'Frog tea lights',
        price: '£4.50',
        description: "Cosy and fragrant",
        srcVar: 'https://images-na.ssl-images-amazon.com/images/I/71PtYn4E49L._AC_SX342_.jpg'
      },
      {
        id: 'p4',
        title: 'Frog music album',
        price: '£8.00',
        description: "Frog lyrics and slap bass tunes",
        srcVar: 'http://www.progarchives.com/progressive_rock_discography_covers/10980/cover_3211152782019_r.jpg'
      },
      {
        id: 'p5',
        title: 'FrogStation 7',
        price: '£284.00',
        description: "Modern gaming for modern times",
        srcVar: 'https://sgwmscdnimages.azureedge.net/22/9-3-2019/20621831094smll.JPG'
      },

    ]);

    /* src/Cart/CartItem.svelte generated by Svelte v3.35.0 */
    const file$5 = "src/Cart/CartItem.svelte";

    // (54:2) <CustomButton mode="outline" on:click={displayDescription}>
    function create_default_slot_1$1(ctx) {
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(54:2) <CustomButton mode=\\\"outline\\\" on:click={displayDescription}>",
    		ctx
    	});

    	return block;
    }

    // (57:2) <CustomButton on:click={removeFromCart}>
    function create_default_slot$3(ctx) {
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
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(57:2) <CustomButton on:click={removeFromCart}>",
    		ctx
    	});

    	return block;
    }

    // (58:2) {#if showDescription}
    function create_if_block$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*description*/ ctx[3]);
    			add_location(p, file$5, 58, 4, 1256);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(58:2) {#if showDescription}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let li;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let custombutton0;
    	let t4;
    	let custombutton1;
    	let t5;
    	let current;

    	custombutton0 = new CustomButton({
    			props: {
    				mode: "outline",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*displayDescription*/ ctx[4]);

    	custombutton1 = new CustomButton({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*removeFromCart*/ ctx[5]);
    	let if_block = /*showDescription*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*price*/ ctx[1]);
    			t3 = space();
    			create_component(custombutton0.$$.fragment);
    			t4 = space();
    			create_component(custombutton1.$$.fragment);
    			t5 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-1yip4ny");
    			add_location(h1, file$5, 51, 2, 974);
    			attr_dev(h2, "class", "svelte-1yip4ny");
    			add_location(h2, file$5, 52, 2, 993);
    			attr_dev(li, "class", "svelte-1yip4ny");
    			add_location(li, file$5, 50, 0, 967);
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
    			append_dev(li, t3);
    			mount_component(custombutton0, li, null);
    			append_dev(li, t4);
    			mount_component(custombutton1, li, null);
    			append_dev(li, t5);
    			if (if_block) if_block.m(li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*price*/ 2) set_data_dev(t2, /*price*/ ctx[1]);
    			const custombutton0_changes = {};

    			if (dirty & /*$$scope, showDescription*/ 132) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);

    			if (/*showDescription*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CartItem", slots, []);
    	let { title } = $$props;
    	let { price } = $$props;
    	let { id } = $$props;
    	let showDescription = false;
    	let description = "Awesome 4k resolution download, be the envy of your friends!";

    	function displayDescription() {
    		$$invalidate(2, showDescription = !showDescription);

    		const unsubscribe = products.subscribe(prods => {
    			$$invalidate(3, description = prods.find(p => p.id === id).description);
    		});

    		unsubscribe();
    	}

    	function removeFromCart() {
    		customCart.removeItem(id);
    	}

    	const writable_props = ["title", "price", "id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CartItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("id" in $$props) $$invalidate(6, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		cartItems: customCart,
    		products,
    		CustomButton,
    		title,
    		price,
    		id,
    		showDescription,
    		description,
    		displayDescription,
    		removeFromCart
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("id" in $$props) $$invalidate(6, id = $$props.id);
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
    		displayDescription,
    		removeFromCart,
    		id
    	];
    }

    class CartItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { title: 0, price: 1, id: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CartItem",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<CartItem> was created without expected prop 'title'");
    		}

    		if (/*price*/ ctx[1] === undefined && !("price" in props)) {
    			console.warn("<CartItem> was created without expected prop 'price'");
    		}

    		if (/*id*/ ctx[6] === undefined && !("id" in props)) {
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
    const file$4 = "src/Cart/Cart.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (27:4) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No items in cart yet!";
    			add_location(p, file$4, 27, 6, 465);
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
    		source: "(27:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#each $cartItems as item (item.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let cartitem;
    	let current;

    	cartitem = new CartItem({
    			props: {
    				id: /*item*/ ctx[1].id,
    				title: /*item*/ ctx[1].title,
    				price: /*item*/ ctx[1].price
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
    			if (dirty & /*$cartItems*/ 1) cartitem_changes.id = /*item*/ ctx[1].id;
    			if (dirty & /*$cartItems*/ 1) cartitem_changes.title = /*item*/ ctx[1].title;
    			if (dirty & /*$cartItems*/ 1) cartitem_changes.price = /*item*/ ctx[1].price;
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(25:4) {#each $cartItems as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$cartItems*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block(ctx);
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Cart";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			add_location(h1, file$4, 22, 2, 315);
    			attr_dev(ul, "class", "svelte-1c2znv1");
    			add_location(ul, file$4, 23, 2, 331);
    			attr_dev(section, "class", "svelte-1c2znv1");
    			add_location(section, file$4, 21, 0, 303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$cartItems*/ 1) {
    				each_value = /*$cartItems*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, null);
    				}
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

    			if (each_1_else) each_1_else.d();
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

    function instance$4($$self, $$props, $$invalidate) {
    	let $cartItems;
    	validate_store(customCart, "cartItems");
    	component_subscribe($$self, customCart, $$value => $$invalidate(0, $cartItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cart", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cart> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ cartItems: customCart, CartItem, $cartItems });
    	return [$cartItems];
    }

    class Cart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cart",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Products/Product.svelte generated by Svelte v3.35.0 */
    const file$3 = "src/Products/Product.svelte";

    // (58:4) <CustomButton on:click={addToCart}>
    function create_default_slot$2(ctx) {
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
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(58:4) <CustomButton on:click={addToCart}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;
    	let p;
    	let t5;
    	let t6;
    	let div1;
    	let custombutton;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton.$on("click", /*addToCart*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*price*/ ctx[1]);
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			p = element("p");
    			t5 = text(/*description*/ ctx[2]);
    			t6 = space();
    			div1 = element("div");
    			create_component(custombutton.$$.fragment);
    			attr_dev(h1, "class", "svelte-1h4apoi");
    			add_location(h1, file$3, 51, 4, 905);
    			attr_dev(h2, "class", "svelte-1h4apoi");
    			add_location(h2, file$3, 52, 4, 926);
    			if (img.src !== (img_src_value = /*srcVar*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "product");
    			attr_dev(img, "class", "svelte-1h4apoi");
    			add_location(img, file$3, 53, 4, 947);
    			attr_dev(p, "class", "svelte-1h4apoi");
    			add_location(p, file$3, 54, 4, 986);
    			add_location(div0, file$3, 50, 2, 895);
    			add_location(div1, file$3, 56, 2, 1018);
    			attr_dev(div2, "class", "product svelte-1h4apoi");
    			add_location(div2, file$3, 49, 0, 871);
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
    			append_dev(div0, t3);
    			append_dev(div0, img);
    			append_dev(div0, t4);
    			append_dev(div0, p);
    			append_dev(p, t5);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			mount_component(custombutton, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (!current || dirty & /*price*/ 2) set_data_dev(t2, /*price*/ ctx[1]);

    			if (!current || dirty & /*srcVar*/ 8 && img.src !== (img_src_value = /*srcVar*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*description*/ 4) set_data_dev(t5, /*description*/ ctx[2]);
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 64) {
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
    			if (detaching) detach_dev(div2);
    			destroy_component(custombutton);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Product", slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let { price } = $$props;
    	let { description } = $$props;
    	let { srcVar } = $$props;

    	function addToCart() {
    		customCart.addItem({ id, title, price });
    	}

    	const writable_props = ["id", "title", "price", "description", "srcVar"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(5, id = $$props.id);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("srcVar" in $$props) $$invalidate(3, srcVar = $$props.srcVar);
    	};

    	$$self.$capture_state = () => ({
    		cartItems: customCart,
    		CustomButton,
    		id,
    		title,
    		price,
    		description,
    		srcVar,
    		addToCart
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(5, id = $$props.id);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("price" in $$props) $$invalidate(1, price = $$props.price);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("srcVar" in $$props) $$invalidate(3, srcVar = $$props.srcVar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, price, description, srcVar, addToCart, id];
    }

    class Product extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			id: 5,
    			title: 0,
    			price: 1,
    			description: 2,
    			srcVar: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[5] === undefined && !("id" in props)) {
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
    const file$2 = "src/Products/Products.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (16:2) {#each $products as product (product.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let product;
    	let current;

    	product = new Product({
    			props: {
    				id: /*product*/ ctx[1].id,
    				title: /*product*/ ctx[1].title,
    				price: /*product*/ ctx[1].price,
    				description: /*product*/ ctx[1].description,
    				srcVar: /*product*/ ctx[1].srcVar
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
    			if (dirty & /*$products*/ 1) product_changes.id = /*product*/ ctx[1].id;
    			if (dirty & /*$products*/ 1) product_changes.title = /*product*/ ctx[1].title;
    			if (dirty & /*$products*/ 1) product_changes.price = /*product*/ ctx[1].price;
    			if (dirty & /*$products*/ 1) product_changes.description = /*product*/ ctx[1].description;
    			if (dirty & /*$products*/ 1) product_changes.srcVar = /*product*/ ctx[1].srcVar;
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(16:2) {#each $products as product (product.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$products*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*product*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Products";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$2, 14, 2, 229);
    			attr_dev(section, "class", "svelte-o8blwk");
    			add_location(section, file$2, 13, 0, 217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$products*/ 1) {
    				each_value = /*$products*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block, null, get_each_context);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $products;
    	validate_store(products, "products");
    	component_subscribe($$self, products, $$value => $$invalidate(0, $products = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Products", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Products> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ products, Product, $products });
    	return [$products];
    }

    class Products extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/UI/Feedback.svelte generated by Svelte v3.35.0 */
    const file$1 = "src/UI/Feedback.svelte";

    // (136:4) <CustomButton>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Share feedback");
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(136:4) <CustomButton>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div0;
    	let h30;
    	let t1;
    	let p0;
    	let i0;
    	let t3;
    	let h20;
    	let div0_intro;
    	let t5;
    	let div1;
    	let h31;
    	let t6;
    	let t7;
    	let t8;
    	let p1;
    	let i1;
    	let t9;
    	let t10;
    	let h21;
    	let t12;
    	let div8;
    	let div2;
    	let h1;
    	let t14;
    	let img;
    	let img_src_value;
    	let t15;
    	let div5;
    	let div3;
    	let header0;
    	let t17;
    	let textarea0;
    	let t18;
    	let div4;
    	let header1;
    	let t20;
    	let h22;
    	let t22;
    	let div7;
    	let textarea1;
    	let t23;
    	let div6;
    	let custombutton;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "User: Anon";
    			t1 = space();
    			p0 = element("p");
    			i0 = element("i");
    			i0.textContent = "\"Good work, keep it up, keep learning!\"";
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "🐸🐸🐸🐸";
    			t5 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			t6 = text("User: ");
    			t7 = text(/*feedUser*/ ctx[0]);
    			t8 = space();
    			p1 = element("p");
    			i1 = element("i");
    			t9 = text(/*feedComment*/ ctx[1]);
    			t10 = space();
    			h21 = element("h2");
    			h21.textContent = `${/*frogStars*/ ctx[2]}`;
    			t12 = space();
    			div8 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Feedback makes me hoppy!";
    			t14 = space();
    			img = element("img");
    			t15 = space();
    			div5 = element("div");
    			div3 = element("div");
    			header0 = element("header");
    			header0.textContent = "Username (Anon by default)";
    			t17 = space();
    			textarea0 = element("textarea");
    			t18 = space();
    			div4 = element("div");
    			header1 = element("header");
    			header1.textContent = "Frog star rating";
    			t20 = space();
    			h22 = element("h2");
    			h22.textContent = "🐸🐸🐸🐸";
    			t22 = space();
    			div7 = element("div");
    			textarea1 = element("textarea");
    			t23 = space();
    			div6 = element("div");
    			create_component(custombutton.$$.fragment);
    			add_location(h30, file$1, 105, 0, 1976);
    			add_location(i0, file$1, 106, 3, 1999);
    			add_location(p0, file$1, 106, 0, 1996);
    			add_location(h20, file$1, 107, 0, 2050);
    			attr_dev(div0, "class", "commentCard svelte-11rajjm");
    			add_location(div0, file$1, 104, 0, 1942);
    			add_location(h31, file$1, 111, 4, 2106);
    			add_location(i1, file$1, 112, 7, 2139);
    			add_location(p1, file$1, 112, 4, 2136);
    			add_location(h21, file$1, 113, 4, 2168);
    			attr_dev(div1, "class", "commentCard svelte-11rajjm");
    			add_location(div1, file$1, 110, 0, 2076);
    			add_location(h1, file$1, 118, 6, 2251);
    			if (img.src !== (img_src_value = "https://www.flaticon.com/svg/vstatic/svg/424/424870.svg?token=exp=1615249621~hmac=e98a24b849aff33ebde9abf8fec9421d")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "frog");
    			attr_dev(img, "class", "svelte-11rajjm");
    			add_location(img, file$1, 119, 6, 2291);
    			attr_dev(div2, "class", "h1 svelte-11rajjm");
    			add_location(div2, file$1, 117, 2, 2228);
    			attr_dev(header0, "class", "svelte-11rajjm");
    			add_location(header0, file$1, 124, 6, 2497);
    			textarea0.value = "Anon";
    			attr_dev(textarea0, "class", "svelte-11rajjm");
    			add_location(textarea0, file$1, 125, 6, 2547);
    			attr_dev(div3, "class", "userInput svelte-11rajjm");
    			add_location(div3, file$1, 123, 4, 2466);
    			attr_dev(header1, "class", "svelte-11rajjm");
    			add_location(header1, file$1, 128, 6, 2615);
    			add_location(h22, file$1, 129, 6, 2655);
    			attr_dev(div4, "class", "rating svelte-11rajjm");
    			add_location(div4, file$1, 127, 4, 2588);
    			attr_dev(div5, "class", "User svelte-11rajjm");
    			add_location(div5, file$1, 122, 2, 2443);
    			attr_dev(textarea1, "class", "commentInput svelte-11rajjm");
    			add_location(textarea1, file$1, 133, 2, 2719);
    			attr_dev(div6, "class", "btnPad svelte-11rajjm");
    			add_location(div6, file$1, 134, 2, 2764);
    			attr_dev(div7, "class", "comment svelte-11rajjm");
    			add_location(div7, file$1, 132, 2, 2695);
    			attr_dev(div8, "class", "grid-container svelte-11rajjm");
    			add_location(div8, file$1, 116, 0, 2197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h30);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(p0, i0);
    			append_dev(div0, t3);
    			append_dev(div0, h20);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h31);
    			append_dev(h31, t6);
    			append_dev(h31, t7);
    			append_dev(div1, t8);
    			append_dev(div1, p1);
    			append_dev(p1, i1);
    			append_dev(i1, t9);
    			append_dev(div1, t10);
    			append_dev(div1, h21);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t14);
    			append_dev(div2, img);
    			append_dev(div8, t15);
    			append_dev(div8, div5);
    			append_dev(div5, div3);
    			append_dev(div3, header0);
    			append_dev(div3, t17);
    			append_dev(div3, textarea0);
    			append_dev(div5, t18);
    			append_dev(div5, div4);
    			append_dev(div4, header1);
    			append_dev(div4, t20);
    			append_dev(div4, h22);
    			append_dev(div8, t22);
    			append_dev(div8, div7);
    			append_dev(div7, textarea1);
    			append_dev(div7, t23);
    			append_dev(div7, div6);
    			mount_component(custombutton, div6, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*feedUser*/ 1) set_data_dev(t7, /*feedUser*/ ctx[0]);
    			if (!current || dirty & /*feedComment*/ 2) set_data_dev(t9, /*feedComment*/ ctx[1]);
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 16) {
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

    			transition_in(custombutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div8);
    			destroy_component(custombutton);
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

    function createFrogStars(numStars) {
    	let numFrogs = [];

    	for (let x = 0; x < numStars; x++) {
    		numFrogs += "🐸";
    	}

    	return numFrogs;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Feedback", slots, []);
    	let { feedUser } = $$props;
    	let { feedComment } = $$props;
    	let { numStars } = $$props;
    	let frogStars = createFrogStars(numStars);
    	const writable_props = ["feedUser", "feedComment", "numStars"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Feedback> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("feedUser" in $$props) $$invalidate(0, feedUser = $$props.feedUser);
    		if ("feedComment" in $$props) $$invalidate(1, feedComment = $$props.feedComment);
    		if ("numStars" in $$props) $$invalidate(3, numStars = $$props.numStars);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		CustomButton,
    		Header,
    		feedUser,
    		feedComment,
    		numStars,
    		frogStars,
    		createFrogStars
    	});

    	$$self.$inject_state = $$props => {
    		if ("feedUser" in $$props) $$invalidate(0, feedUser = $$props.feedUser);
    		if ("feedComment" in $$props) $$invalidate(1, feedComment = $$props.feedComment);
    		if ("numStars" in $$props) $$invalidate(3, numStars = $$props.numStars);
    		if ("frogStars" in $$props) $$invalidate(2, frogStars = $$props.frogStars);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [feedUser, feedComment, frogStars, numStars];
    }

    class Feedback extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { feedUser: 0, feedComment: 1, numStars: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Feedback",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*feedUser*/ ctx[0] === undefined && !("feedUser" in props)) {
    			console.warn("<Feedback> was created without expected prop 'feedUser'");
    		}

    		if (/*feedComment*/ ctx[1] === undefined && !("feedComment" in props)) {
    			console.warn("<Feedback> was created without expected prop 'feedComment'");
    		}

    		if (/*numStars*/ ctx[3] === undefined && !("numStars" in props)) {
    			console.warn("<Feedback> was created without expected prop 'numStars'");
    		}
    	}

    	get feedUser() {
    		throw new Error("<Feedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set feedUser(value) {
    		throw new Error("<Feedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get feedComment() {
    		throw new Error("<Feedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set feedComment(value) {
    		throw new Error("<Feedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numStars() {
    		throw new Error("<Feedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numStars(value) {
    		throw new Error("<Feedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */
    const file = "src/App.svelte";

    // (141:4) <CustomButton btntype="submit" on:click="{() => {mainPage = true; aboutPage = false; playQuiz = false; goShop = false; feedback = false;}}">
    function create_default_slot_7(ctx) {
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
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(141:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {mainPage = true; aboutPage = false; playQuiz = false; goShop = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:4) <CustomButton btntype="submit" on:click="{() => {aboutPage = true; mainPage = false; playQuiz = false; goShop = false; feedback = false;}}">
    function create_default_slot_6(ctx) {
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
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(142:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {aboutPage = true; mainPage = false; playQuiz = false; goShop = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (143:4) <CustomButton btntype="submit" on:click="{() => editMode = 'add'}">
    function create_default_slot_5(ctx) {
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
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(143:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => editMode = 'add'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (144:4) <CustomButton btntype="submit" on:click="{() => {playQuiz = true; aboutPage = false; goShop = false; feedback = false;}}">
    function create_default_slot_4(ctx) {
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
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(144:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {playQuiz = true; aboutPage = false; goShop = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (145:4) <CustomButton btntype="submit" on:click="{() => {goShop = true; aboutPage = false; playQuiz = false; feedback = false;}}">
    function create_default_slot_3(ctx) {
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
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(145:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {goShop = true; aboutPage = false; playQuiz = false; feedback = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (146:4) <CustomButton btntype="submit" on:click="{() => {feedback = true; mainPage = false; goShop = false; aboutPage = false; playQuiz = false;}}">
    function create_default_slot_2(ctx) {
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(146:4) <CustomButton btntype=\\\"submit\\\" on:click=\\\"{() => {feedback = true; mainPage = false; goShop = false; aboutPage = false; playQuiz = false;}}\\\">",
    		ctx
    	});

    	return block;
    }

    // (149:4) {#if editMode === 'add'}
    function create_if_block_7(ctx) {
    	let editadopt;
    	let current;
    	editadopt = new EditAdopt({ $$inline: true });
    	editadopt.$on("adoption-submit", /*addFrog*/ ctx[9]);
    	editadopt.$on("cancel", /*cancelForm*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(editadopt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editadopt, target, anchor);
    			current = true;
    		},
    		p: noop,
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(149:4) {#if editMode === 'add'}",
    		ctx
    	});

    	return block;
    }

    // (153:4) {#if adoptMode === 'adopt'}
    function create_if_block_6(ctx) {
    	let adopt;
    	let current;
    	adopt = new Adopt({ $$inline: true });
    	adopt.$on("cancel-adopt", /*hideAdopt*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(adopt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(adopt, target, anchor);
    			current = true;
    		},
    		p: noop,
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(153:4) {#if adoptMode === 'adopt'}",
    		ctx
    	});

    	return block;
    }

    // (157:4) {#if playQuiz === true && goShop === false && feedback === false}
    function create_if_block_5(ctx) {
    	let h1;
    	let t1;
    	let quiz;
    	let current;
    	quiz = new Quiz({ $$inline: true });

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Nature Quiz";
    			t1 = space();
    			create_component(quiz.$$.fragment);
    			attr_dev(h1, "class", "svelte-sn93le");
    			add_location(h1, file, 157, 4, 5431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(quiz, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quiz.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quiz.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_component(quiz, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(157:4) {#if playQuiz === true && goShop === false && feedback === false}",
    		ctx
    	});

    	return block;
    }

    // (162:4) {#if feedback === true && playQuiz === false  && goShop === false}
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
    		source: "(162:4) {#if feedback === true && playQuiz === false  && goShop === false}",
    		ctx
    	});

    	return block;
    }

    // (167:4) {#if mainPage === true && playQuiz === false && goShop === false && feedback === false}
    function create_if_block_3(ctx) {
    	let intro;
    	let t;
    	let adoptgrid;
    	let current;

    	intro = new Intro({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	adoptgrid = new AdoptGrid({
    			props: { frogs: /*frogs*/ ctx[8] },
    			$$inline: true
    		});

    	adoptgrid.$on("toggle-favourite", /*toggleFavourite*/ ctx[10]);
    	adoptgrid.$on("adopt-event", /*showAdopt*/ ctx[12]);

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

    			if (dirty & /*$$scope*/ 2097152) {
    				intro_changes.$$scope = { dirty, ctx };
    			}

    			intro.$set(intro_changes);
    			const adoptgrid_changes = {};
    			if (dirty & /*frogs*/ 256) adoptgrid_changes.frogs = /*frogs*/ ctx[8];
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
    		source: "(167:4) {#if mainPage === true && playQuiz === false && goShop === false && feedback === false}",
    		ctx
    	});

    	return block;
    }

    // (168:4) <Intro>
    function create_default_slot_1(ctx) {
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(168:4) <Intro>",
    		ctx
    	});

    	return block;
    }

    // (172:4) {#if aboutPage === true}
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
    		source: "(172:4) {#if aboutPage === true}",
    		ctx
    	});

    	return block;
    }

    // (176:4) {#if goShop === true && playQuiz === false}
    function create_if_block(ctx) {
    	let div;
    	let custombutton;
    	let t0;
    	let t1;
    	let products;
    	let current;

    	custombutton = new CustomButton({
    			props: {
    				stateColour: "toggle",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton.$on("click", /*click_handler_6*/ ctx[20]);
    	let if_block = /*showCart*/ ctx[3] && create_if_block_1(ctx);
    	products = new Products({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(custombutton.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			create_component(products.$$.fragment);
    			attr_dev(div, "class", "toggle svelte-sn93le");
    			add_location(div, file, 176, 4, 6037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(custombutton, div, null);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(products, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const custombutton_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				custombutton_changes.$$scope = { dirty, ctx };
    			}

    			custombutton.$set(custombutton_changes);

    			if (/*showCart*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*showCart*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
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
    			transition_in(custombutton.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(products.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(custombutton.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(products.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(custombutton);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(products, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(176:4) {#if goShop === true && playQuiz === false}",
    		ctx
    	});

    	return block;
    }

    // (178:4) <CustomButton stateColour="toggle" on:click={() => {showCart = !showCart;}}>
    function create_default_slot(ctx) {
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(178:4) <CustomButton stateColour=\\\"toggle\\\" on:click={() => {showCart = !showCart;}}>",
    		ctx
    	});

    	return block;
    }

    // (182:4) {#if showCart}
    function create_if_block_1(ctx) {
    	let cart;
    	let current;
    	cart = new Cart({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(cart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cart, target, anchor);
    			current = true;
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
    		source: "(182:4) {#if showCart}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let div;
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
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	custombutton0 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton0.$on("click", /*click_handler*/ ctx[14]);

    	custombutton1 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton1.$on("click", /*click_handler_1*/ ctx[15]);

    	custombutton2 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton2.$on("click", /*click_handler_2*/ ctx[16]);

    	custombutton3 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton3.$on("click", /*click_handler_3*/ ctx[17]);

    	custombutton4 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton4.$on("click", /*click_handler_4*/ ctx[18]);

    	custombutton5 = new CustomButton({
    			props: {
    				btntype: "submit",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	custombutton5.$on("click", /*click_handler_5*/ ctx[19]);
    	let if_block0 = /*editMode*/ ctx[4] === "add" && create_if_block_7(ctx);
    	let if_block1 = /*adoptMode*/ ctx[5] === "adopt" && create_if_block_6(ctx);
    	let if_block2 = /*playQuiz*/ ctx[1] === true && /*goShop*/ ctx[2] === false && /*feedback*/ ctx[7] === false && create_if_block_5(ctx);
    	let if_block3 = /*feedback*/ ctx[7] === true && /*playQuiz*/ ctx[1] === false && /*goShop*/ ctx[2] === false && create_if_block_4(ctx);
    	let if_block4 = /*mainPage*/ ctx[0] === true && /*playQuiz*/ ctx[1] === false && /*goShop*/ ctx[2] === false && /*feedback*/ ctx[7] === false && create_if_block_3(ctx);
    	let if_block5 = /*aboutPage*/ ctx[6] === true && create_if_block_2(ctx);
    	let if_block6 = /*goShop*/ ctx[2] === true && /*playQuiz*/ ctx[1] === false && create_if_block(ctx);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div = element("div");
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
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			t8 = space();
    			if (if_block2) if_block2.c();
    			t9 = space();
    			if (if_block3) if_block3.c();
    			t10 = space();
    			if (if_block4) if_block4.c();
    			t11 = space();
    			if (if_block5) if_block5.c();
    			t12 = space();
    			if (if_block6) if_block6.c();
    			t13 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "formControl svelte-sn93le");
    			add_location(div, file, 139, 4, 4210);
    			attr_dev(main, "class", "svelte-sn93le");
    			add_location(main, file, 138, 0, 4199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(custombutton0, div, null);
    			append_dev(div, t1);
    			mount_component(custombutton1, div, null);
    			append_dev(div, t2);
    			mount_component(custombutton2, div, null);
    			append_dev(div, t3);
    			mount_component(custombutton3, div, null);
    			append_dev(div, t4);
    			mount_component(custombutton4, div, null);
    			append_dev(div, t5);
    			mount_component(custombutton5, div, null);
    			append_dev(main, t6);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t7);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t8);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t9);
    			if (if_block3) if_block3.m(main, null);
    			append_dev(main, t10);
    			if (if_block4) if_block4.m(main, null);
    			append_dev(main, t11);
    			if (if_block5) if_block5.m(main, null);
    			append_dev(main, t12);
    			if (if_block6) if_block6.m(main, null);
    			append_dev(main, t13);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const custombutton0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				custombutton0_changes.$$scope = { dirty, ctx };
    			}

    			custombutton0.$set(custombutton0_changes);
    			const custombutton1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				custombutton1_changes.$$scope = { dirty, ctx };
    			}

    			custombutton1.$set(custombutton1_changes);
    			const custombutton2_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				custombutton2_changes.$$scope = { dirty, ctx };
    			}

    			custombutton2.$set(custombutton2_changes);
    			const custombutton3_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				custombutton3_changes.$$scope = { dirty, ctx };
    			}

    			custombutton3.$set(custombutton3_changes);
    			const custombutton4_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				custombutton4_changes.$$scope = { dirty, ctx };
    			}

    			custombutton4.$set(custombutton4_changes);
    			const custombutton5_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				custombutton5_changes.$$scope = { dirty, ctx };
    			}

    			custombutton5.$set(custombutton5_changes);

    			if (/*editMode*/ ctx[4] === "add") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*editMode*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t7);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*adoptMode*/ ctx[5] === "adopt") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*adoptMode*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, t8);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*playQuiz*/ ctx[1] === true && /*goShop*/ ctx[2] === false && /*feedback*/ ctx[7] === false) {
    				if (if_block2) {
    					if (dirty & /*playQuiz, goShop, feedback*/ 134) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(main, t9);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*feedback*/ ctx[7] === true && /*playQuiz*/ ctx[1] === false && /*goShop*/ ctx[2] === false) {
    				if (if_block3) {
    					if (dirty & /*feedback, playQuiz, goShop*/ 134) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_4(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(main, t10);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*mainPage*/ ctx[0] === true && /*playQuiz*/ ctx[1] === false && /*goShop*/ ctx[2] === false && /*feedback*/ ctx[7] === false) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*mainPage, playQuiz, goShop, feedback*/ 135) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_3(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(main, t11);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*aboutPage*/ ctx[6] === true) {
    				if (if_block5) {
    					if (dirty & /*aboutPage*/ 64) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_2(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(main, t12);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (/*goShop*/ ctx[2] === true && /*playQuiz*/ ctx[1] === false) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty & /*goShop, playQuiz*/ 6) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(main, t13);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
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
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
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
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(custombutton0);
    			destroy_component(custombutton1);
    			destroy_component(custombutton2);
    			destroy_component(custombutton3);
    			destroy_component(custombutton4);
    			destroy_component(custombutton5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let mainPage = true;
    	let playQuiz = false;
    	let goShop = false;
    	let showCart = true;
    	let editMode = null;
    	let adoptMode = null;
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
    			$$invalidate(8, frogs = [newFrog, ...frogs]);
    		}

    		$$invalidate(4, editMode = null);
    	}

    	function toggleFavourite(event) {
    		const id = event.detail;

    		//find is a new piece of modern JS
    		const updatedFrog = { ...frogs.find(m => m.id === id) };

    		updatedFrog.isFavourite = !updatedFrog.isFavourite;
    		const frogIndex = frogs.findIndex(m => m.id === id);
    		const updatedFrogs = [...frogs];
    		updatedFrogs[frogIndex] = updatedFrog;
    		$$invalidate(8, frogs = updatedFrogs);
    	}

    	function cancelForm(event) {
    		$$invalidate(4, editMode = "null");
    	}

    	function showAdopt(event) {
    		$$invalidate(5, adoptMode = "adopt");
    	}

    	function hideAdopt(event) {
    		$$invalidate(5, adoptMode = null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, mainPage = true);
    		$$invalidate(6, aboutPage = false);
    		$$invalidate(1, playQuiz = false);
    		$$invalidate(2, goShop = false);
    		$$invalidate(7, feedback = false);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(6, aboutPage = true);
    		$$invalidate(0, mainPage = false);
    		$$invalidate(1, playQuiz = false);
    		$$invalidate(2, goShop = false);
    		$$invalidate(7, feedback = false);
    	};

    	const click_handler_2 = () => $$invalidate(4, editMode = "add");

    	const click_handler_3 = () => {
    		$$invalidate(1, playQuiz = true);
    		$$invalidate(6, aboutPage = false);
    		$$invalidate(2, goShop = false);
    		$$invalidate(7, feedback = false);
    	};

    	const click_handler_4 = () => {
    		$$invalidate(2, goShop = true);
    		$$invalidate(6, aboutPage = false);
    		$$invalidate(1, playQuiz = false);
    		$$invalidate(7, feedback = false);
    	};

    	const click_handler_5 = () => {
    		$$invalidate(7, feedback = true);
    		$$invalidate(0, mainPage = false);
    		$$invalidate(2, goShop = false);
    		$$invalidate(6, aboutPage = false);
    		$$invalidate(1, playQuiz = false);
    	};

    	const click_handler_6 = () => {
    		$$invalidate(3, showCart = !showCart);
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
    		Products,
    		Feedback,
    		mainPage,
    		playQuiz,
    		goShop,
    		showCart,
    		editMode,
    		adoptMode,
    		aboutPage,
    		feedback,
    		frogs,
    		addFrog,
    		toggleFavourite,
    		cancelForm,
    		showAdopt,
    		hideAdopt
    	});

    	$$self.$inject_state = $$props => {
    		if ("mainPage" in $$props) $$invalidate(0, mainPage = $$props.mainPage);
    		if ("playQuiz" in $$props) $$invalidate(1, playQuiz = $$props.playQuiz);
    		if ("goShop" in $$props) $$invalidate(2, goShop = $$props.goShop);
    		if ("showCart" in $$props) $$invalidate(3, showCart = $$props.showCart);
    		if ("editMode" in $$props) $$invalidate(4, editMode = $$props.editMode);
    		if ("adoptMode" in $$props) $$invalidate(5, adoptMode = $$props.adoptMode);
    		if ("aboutPage" in $$props) $$invalidate(6, aboutPage = $$props.aboutPage);
    		if ("feedback" in $$props) $$invalidate(7, feedback = $$props.feedback);
    		if ("frogs" in $$props) $$invalidate(8, frogs = $$props.frogs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mainPage,
    		playQuiz,
    		goShop,
    		showCart,
    		editMode,
    		adoptMode,
    		aboutPage,
    		feedback,
    		frogs,
    		addFrog,
    		toggleFavourite,
    		cancelForm,
    		showAdopt,
    		hideAdopt,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
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
