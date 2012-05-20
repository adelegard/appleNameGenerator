class CreateResponseWords < ActiveRecord::Migration
  def change
    create_table :response_words do |t|
      t.string :synonym
      t.string :response

      t.timestamps
    end
  end
end
