export default{
  GroupColors (num) {
    const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue',
      'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime',
      'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey']
    return colors[num % colors.length]
  }
}
