import Component from '@glimmer/component';
import { TrackedWeakMap } from '@sandydoo/tracked-maps-and-sets';

import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { reactivityTest } from '../helpers/reactivity';

module('TrackedWeakMap', function(hooks) {
  setupRenderingTest(hooks);

  test('constructor', assert => {
    let obj = {};
    let map = new TrackedWeakMap([[obj, 123]]);

    assert.equal(map.get(obj), 123);
  });

  test('does not work with built-ins', assert => {
    let map = new TrackedWeakMap();

    assert.throws(
      () => map.set('aoeu', 123),
      /Invalid value used as weak map key/
    );
    assert.throws(
      () => map.set(true, 123),
      /Invalid value used as weak map key/
    );
    assert.throws(
      () => map.set(123, 123),
      /Invalid value used as weak map key/
    );
    assert.throws(
      () => map.set(undefined, 123),
      /Invalid value used as weak map key/
    );
  });

  test('get/set', assert => {
    let obj = {};
    let map = new TrackedWeakMap();

    map.set(obj, 123);
    assert.equal(map.get(obj), 123);

    map.set(obj, 456);
    assert.equal(map.get(obj), 456);
  });

  test('has', assert => {
    let obj = {};
    let map = new TrackedWeakMap();

    assert.equal(map.has(obj), false);
    map.set(obj, 123);
    assert.equal(map.has(obj), true);
  });

  test('delete', assert => {
    let obj = {};
    let map = new TrackedWeakMap();

    assert.equal(map.has(obj), false);

    map.set(obj, 123);
    assert.equal(map.has(obj), true);

    map.delete(obj);
    assert.equal(map.has(obj), false);
  });

  reactivityTest(
    'get/set',
    class extends Component {
      obj = {};
      map = new TrackedWeakMap();

      get value() {
        return this.map.get(this.obj);
      }

      update() {
        this.map.set(this.obj, 123);
      }
    }
  );

  reactivityTest(
    'get/set existing value',
    class extends Component {
      obj = {};
      map = new TrackedWeakMap([[this.obj, 456]]);

      get value() {
        return this.map.get(this.obj);
      }

      update() {
        this.map.set(this.obj, 123);
      }
    }
  );

  reactivityTest(
    'get/set unrelated value',
    class extends Component {
      obj = {};
      obj2 = {};
      map = new TrackedWeakMap([[this.obj, 456]]);

      get value() {
        return this.map.get(this.obj);
      }

      update() {
        this.map.set(this.obj2, 123);
      }
    },
    false
  );

  reactivityTest(
    'has',
    class extends Component {
      obj = {};
      map = new TrackedWeakMap();

      get value() {
        return this.map.has(this.obj);
      }

      update() {
        this.map.set(this.obj, 123);
      }
    }
  );

  reactivityTest(
    'delete',
    class extends Component {
      obj = {};
      map = new TrackedWeakMap([[this.obj, 123]]);

      get value() {
        return this.map.get(this.obj);
      }

      update() {
        this.map.delete(this.obj);
      }
    }
  );

  reactivityTest(
    'delete unrelated value',
    class extends Component {
      obj = {};
      obj2 = {};
      map = new TrackedWeakMap([[this.obj, 123], [this.obj2, 456]]);

      get value() {
        return this.map.get(this.obj);
      }

      update() {
        this.map.delete(this.obj2);
      }
    },
    false
  );
});
