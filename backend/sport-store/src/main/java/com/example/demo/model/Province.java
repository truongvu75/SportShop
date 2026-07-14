package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Tỉnh, thành
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "province")
public class Province {
	/**
	 * Tên tỉnh/thành phố
	 */
	@Id
	@Column(name = "provincename")
	private String provinceName;
}
