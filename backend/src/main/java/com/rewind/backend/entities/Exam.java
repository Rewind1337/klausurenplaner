package com.rewind.backend.entities;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.sun.istack.NotNull;

@Entity(name = "Exam")
@Table(name="exam")
public class Exam implements Serializable {
	private static final long serialVersionUID = 8490039082113442241L;

	@Column(name="ID")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Id
	private long id;
	
	@Column(name="date")
	@NotNull
	private Date date;
	
	@Column(name="description")
	private String description;
	
	@Column(name="topic")
	@NotNull
	private String topic;
	
	@Column(name="classgrade")
	@NotNull
	private String classgrade;

    @ManyToOne
	private User user;
	
	public Exam(long id, Date date, String description, String topic, String classgrade, User user) {
		super();
		this.id = id;
		this.date = date;
		this.description = description;
		this.topic = topic;
		this.classgrade = classgrade;
		this.user = user;
	}

	public Exam() {
		super();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public String getClassgrade() {
		return classgrade;
	}

	public void setClassgrade(String classgrade) {
		this.classgrade = classgrade;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
}
