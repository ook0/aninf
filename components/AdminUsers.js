// Services
import { User } from '../services/User';
// Components
import { LoadingCircle } from './LoadingCircle'; 

export default class AdminUsers extends React.Component {

  state={
    users: [],
    usersError    : false,
    usersLoading  : true,
    loadingMore : false,
    loadMoreMessage : 'Daha fazla yükle',
  }

  componentDidMount = async () => {
    const users = await User.paginate(0, 2);
    if(!users) this.setState({ usersError: true })
    this.setState({ users, usersLoading: false });
  }

  loadMore = async () => {
    this.setState({ loadingMore: true });
    const { users } = this.state;
    const moreUsers = await User.paginate(users[users.length-1], 2);
    if(moreUsers){
      if(moreUsers.length > 0){
        this.setState({ users: [...users, ...moreUsers], loadMoreMessage: 'Daha fazla göster' })
      } else {
        this.setState({ loadMoreMessage: 'Gösterilecek daha fazla kullanıcı yok' })
      }
    } else {
      this.setState({ loadMoreMessage: 'Daha fazla kullanıcı yüklenirken hata meydana geldi!' })
    }
    this.setState({ loadingMore: false });
  }

  usersList = () => {
    const { usersLoading, usersError, users } = this.state;
    if(usersLoading){
      return <div className="admin-users-list"><LoadingCircle /></div>
    } else {
      if(usersError){
        return <div className="admin-users-list"><p>Kullanıcılar yüklenirken hata meydana geldi</p></div>
      } else {
          if(users.length === 0){
            return <div className="admin-users-list"><p>Kullanıcı bulunamadı</p></div>
          } else {
            return(
              <div className="admin-users-list">
                {
                  users.map(user => {
                    return(
                      <div key={user.id} className="admin-user-view">
                        <img src={user.data().photoURL} />
                        <p>{user.data().displayName}</p>
                      </div>
                    )
                  })
                }
              </div>
            )
          }
      }
    }
  }
  
  render() {
    const { loadMoreMessage, loadingMore } = this.state;
    return (
      <div className="admin-users">
        <h2>Kullanıcılar</h2>
        {this.usersList()}
        {loadingMore ? <div><LoadingCircle /></div> : <button className="load-more" onClick={this.loadMore}>{loadMoreMessage}</button>}
      </div>
    )
  }
}