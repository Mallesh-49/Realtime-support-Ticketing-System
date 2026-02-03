<?php

namespace App;

enum Status: string
{
    case OPEN = 'open';
    case CLOSED = 'closed';
}