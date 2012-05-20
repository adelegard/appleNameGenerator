class AddSynonymCountToResponseWords < ActiveRecord::Migration
  def change
    add_column :response_words, :synonym_count, :integer
  end
end
