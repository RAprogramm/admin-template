const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
]

const formatDate = ( dateString: Date, len?: 'long' ) => {
  const date = new Date( dateString )
  const hours = date.getHours().toString().padStart( 2, '0' )
  const minutes = date.getMinutes().toString().padStart( 2, '0' )
  const day = date.getDate().toString().padStart( 2, '0' )
  const monthShort = ( date.getMonth() ).toString().padStart( 2, '0' )
  const monthLong = ( months[ date.getMonth() ] ).toString().padStart( 2, '0' )
  const year = date.getFullYear()

  const longDate = `${ day } ${ monthLong } ${ year }`
  const shortDate = `${ day }.${ monthShort }.${ year }`
  const formatedTime = `${ hours }:${ minutes }`

  const formated = len === 'long' ? longDate : shortDate
  return `${ formated }, ${ formatedTime }`
}

export default formatDate
