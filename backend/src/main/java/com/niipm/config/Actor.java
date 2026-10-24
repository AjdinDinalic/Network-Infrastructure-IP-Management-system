package com.niipm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class Actor {

    private final long id;

    public Actor(@Value("${niipm.default-actor-id:1}") long id) {
        this.id = id;
    }

    public long id() {
        return id;
    }
}
