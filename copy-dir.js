const fs = require('fs-extra')

fs.copy('views', 'dist/views')
  .then(() => console.log('views.success!'))
  .catch(err => console.error(err))

fs.copy('public', 'dist/public')
  .then(() => console.log('public.success!'))
  .catch(err => console.error(err))