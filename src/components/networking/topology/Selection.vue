<template>
  <div class="notification" id="selection">
    <div class="close">
      <button class="icon" @click="close()" title="unselect">❌</button>
    </div>
    <div class="mini-list">
      <table v-if="type == 'node'" class="va-table va-table--striped va-table--hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Agent</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.agent }}</td>
            <td>{{ data.status }}</td>
            <td>
              <button class="icon" @click="deleteNode(data._id)" title="delete">
                <span class="fa fa-trash" aria-hidden="true"> </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-if="type == 'link'" class="va-table va-table--striped va-table--hoverable">
        <thead>
          <tr>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ data.status }}</td>
            <td>
              <button class="icon" @click="deleteLink(data._id)" title="delete">
                <span class="fa fa-trash" aria-hidden="true"> </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'selection',
  props: ['type', 'data'],
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('action', 'close')
    },
    deleteNode (id) {
      this.$emit('action', 'delete-node', [id])
    },
    deleteLink (id) {
      this.$emit('action', 'delete-link', [id])
    },
  },
  computed: {
  },
}
</script>
<style lang="stylus">
button.icon {
  background-color: #ffffff;
  border-style: none;
  font-size: 1em;
  height: 1.5em;
  width: 1.5em;
  line-height: 1.25em;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  color: $color;
}

button.big {
  margin-bottom: 1em;
}

button.big span {
  font-size: 2em;
}

.mini {
  font-size: 0.75em;
}

.title {
  color: $color;
  font-weight: bold;
}

table {
  margin: 0 0 0 0;
}

tr {
  border-bottom: solid 1px #d3d3d3;
}

th {
  border-bottom: solid 2px #d3d3d3;
}

th,
td {
  padding: 0 0.5em;
  text-align: left;
}

.mini-list,
ul.list {
  display: inline-block;
  list-style: none;
}

.notification {
  position: absolute;
  bottom: 7em;
  right: 3em;
  z-index: 100;
  width: auto;
  padding: 2em 3em 2em 2em;
  border-radius: 0.5em;
  border: $border;
  background-color: #e6e6e6;
  box-shadow: $hard-sh;
}

.notification .mini-list {
  max-height: 7em;
  overflow-y: scroll;
  overflow-x: hidden;
}

.tabs-component {
  margin: 0 0;
}

.tabs-component-tabs {
  border: solid 1px #dddddd;
  border-radius: 6px;
  margin-bottom: 5px;
}

@media (min-width: 700px) {
  .tabs-component-tabs {
    border: 0;
    align-items: stretch;
    display: flex;
    justify-content: flex-start;
    margin-bottom: -1px;
  }
}

.tabs-component-tab {
  color: #999999;
  font-size: 14px;
  font-weight: 600;
  margin-right: 0;
  list-style: none;
}

.tabs-component-tab:not(:last-child) {
  border-bottom: dotted 1px #dddddd;
}

.tabs-component-tab:hover {
  color: #666666;
}

.tabs-component-tab.is-active {
  color: #000000;
}

.tabs-component-tab.is-disabled * {
  color: #cdcdcd;
  cursor: not-allowed !important;
}

@media (min-width: 700px) {
  .tabs-component-tab {
    background-color: #ffffff;
    border: solid 1px #dddddd;
    border-radius: 3px 3px 0 0;
    margin-right: 0.5em;
    transform: translateY(2px);
    transition: transform 0.3s ease;
  }

  .tabs-component-tab.is-active {
    border-bottom: solid 1px #ffffff;
    z-index: 2;
    transform: translateY(0);
  }
}

.tabs-component-tab-a {
  color: inherit;
  display: flex;
  padding: 0.75em 1em;
  text-decoration: none;
}

.tabs-component-panels {
  padding: 4em 0;
}

@media (min-width: 400px) {
  .tabs-component-panels {
    background-color: #ffffff;
    border: solid 1px #dddddd;
    border-radius: 0 6px 6px 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    padding: 4em 5em;
  }
}

</style>
