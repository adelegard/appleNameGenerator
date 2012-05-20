AppleNameGenerator::Application.routes.draw do
  get "home/index"

  root :to => "home#index"
  match '/nn' => 'home#name'
  match '*path' => redirect('/')

end
