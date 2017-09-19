import React, { Component } from 'react';
import { Card, Rate } from 'antd';
import './cardArea.css';
import {Row, Col, code} from 'react-bootstrap'


class CardArea extends Component {

	constructor(props) {
        super(props);
        this.state = { 
            images: []
        };
        this.renderCards = this.renderCards.bind (this);
    }
    

    renderCards() {
    	// let mrk = [];
    	// let imagesPair = [];
    	// this.props.markers.map(function(marker) {
    	// 	if(imagesPair.length < 2) {
    	// 		imagesPair.push(marker);
    	// 	} else {
    	// 		mrk.push(imagesPair);
    	// 		imagesPair = [];
    	// 		imagesPair.push(marker);
    	// 	}
    	// });

    	// if(imagesPair.length !== 0) {
    	// 	mrk.push(imagesPair);
    	// }

        const x = this;
            const cards_list = this.props.markers.map(function(markerData, i) {

            	return (
            		<div className="cards">
            		<Row className="show-grid">
    				  <Col xs={12} md={6}>
    				  	<code>
    				  		<Card id={markerData.sessionId} onMouseEnter={()=>{x.props.handleMouseEnter(markerData)}} onMouseLeave={()=>{x.props.handleMouseLeave(markerData)}} key = {i} style={{ width: 300 }} bodyStyle={{ padding: 0 }}>
    				  			<div className="custom-image" style={{height: 230}}>
  							  	  <img width="100%" height="230px" src= {markerData.image} />
  							  	</div>
    				  			<div className="custom-card">
  							  	  <h3>{markerData.name}</h3>
  							  	  <p>{markerData.address}</p>
  							  	  <Rate disabled defaultValue={markerData.rate} style={{height: 31}}/>
  							  	</div>
  							</Card>
    				  	</code>
    				  </Col>
    				</Row>
    				</div>
            	);

            });

            return (
                <div>{cards_list}</div>
            );
    }

	render() {
		if(this.props.markers.length !== 0) {
			return (
				<div>
       				{this.renderCards()}
       			</div>
			);
		} else {
			return (
       			<div> Start Search Something ... </div>  
			);
		}
		
		
	}
	
}

export default CardArea;