// Services
import { Knowledge } from '../../services/Knowledge';
import { User } from '../../services/User';
// Components
import { LoadingCircle } from '../LoadingCircle'; 
// Icnos
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

export default class AdminReportView extends React.Component {

  state={
    reportAuthor  : false,
    reportedItem  : false,
    detailsOpen   : false,
    detailsLoading: false,
    loadingError  : false,
  }

  handleDetailsOpen = async () => {
    const { reportAuthor, reportedItem, loadingError } = this.state;
    if((!reportAuthor && !reportedItem) || loadingError){
      this.setState({ detailsLoading: true })
      await this.getReportDetails();
    } 
    this.setState({ detailsOpen: !this.state.detailsOpen });
  }

  getReportDetails = async () => {
    await this.getReportAuthor();
    if(this.state.reportAuthor){
      await this.getReportedItem();
      if(!this.state.reportedItem){
        await this.setState({ loadingError: true });
      }
    } else {
      await this.setState({ loadingError: true })
    }
    this.setState({ detailsLoading: false });
  }

  getReportedItem = async () => {
    const reportedItem = await Knowledge.findByID(this.props.report.data().reportedItem);
    await this.setState({ reportedItem })
  }

  getReportAuthor = async () => {
    const reportAuthor = await User.findByID(this.props.report.data().author);
    await this.setState({ reportAuthor })
  }

  reportDetails = () => {
    const { detailsLoading, loadingError, reportAuthor, reportedItem } = this.state;
    if(detailsLoading){
      return <div className="admin-report-details"><LoadingCircle /></div>
    } else {
      if(loadingError){
        return <p>Detaylar yüklenirken hata meydana geldi</p>
      } else {
        return(
          <div className="admin-report-details">
            <div className="admin-report-author">
              <p className="bold">{reportAuthor.data().displayName}</p>
              <p>{reportAuthor.data().email}</p>
              <p>{reportAuthor.id}</p>
            </div>
            <div className="admin-report-knowledge">
              <div className="admin-report-knowledge-author">
                <p className="bold">{reportedItem.dbObject.data().title}</p>
                <p className="my-3">{reportedItem.dbObject.data().summary}</p>
                <p>{reportedItem.dbObject.data().source}</p>
                <p>{reportedItem.dbObject.id}</p>
              </div>
              <div className="my-3">
                <p className="bold">{reportedItem.dbObject.data().author.displayName}</p>
                <p>{reportedItem.dbObject.data().author.email}</p>
                <p>{reportedItem.dbObject.data().author.id}</p>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  render() {
    const { report } = this.props;
    const { detailsOpen, detailsLoading } = this.state;
    return (
      <div key={report.id} className="admin-report-view">
        <div className="admin-report-view-title">
          <p className="bold">{report.data().description}</p>
          <button onClick={this.handleDetailsOpen}>{detailsOpen ? <FaAngleUp /> : <FaAngleDown />}</button>
        </div>
        {
          (detailsOpen || detailsLoading) && this.reportDetails()
        }

      </div>
    )
  }
}
