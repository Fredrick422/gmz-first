'use strict'

const Schema = use('Schema')

class MenuSchema extends Schema {
  up () {
    this.create('menus', (table) => {
      table.increments()
      table.timestamps()
      table.string('m_name', 80).notNullable()
      table.string('m_slug', 80)
      table.string('m_section', 80)
      table.integer('m_postion', 2)
      table.boolean('m_is_parent').defaultTo(false)
      table.integer('m_parent_id', 4)
      table.string('m_icon', 80)
      table.string('m_link', 80)
      table.integer('m_type', 2)
    })
  }

  down () {
    this.drop('menus')
  }
}

module.exports = MenuSchema
